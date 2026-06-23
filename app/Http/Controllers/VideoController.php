<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Video;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VideoController extends Controller
{
    /** Public listing page */
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        $query = Video::with('category')
            ->where('is_active', true)
            ->orderByDesc('created_at');

        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        $videos = $query->get()->map(fn ($v) => [
            'id'           => $v->id,
            'title'        => $v->title[$locale] ?? $v->title['da'] ?? '',
            'instructor'   => $v->instructor,
            'category'     => $v->category->name[$locale] ?? $v->category->name['da'] ?? '',
            'categorySlug' => $v->category->slug,
            'duration'     => $v->duration,
            'views'        => $v->views,
            'year'         => $v->year,
            'status'       => $v->status,
            'description'  => $v->description[$locale] ?? ($v->description['da'] ?? ''),
            'thumbnail'    => $v->thumbnail,
            'video_source' => $v->video_source ?? 'link',
            'video_url'    => $v->video_url,
            'has_file'     => (bool) $v->file_path,
            'youtube_id'   => self::extractYoutubeId($v->video_url),
        ]);

        $categories = Category::where('type', 'video')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name[$locale] ?? $c->name['da'] ?? '']);

        return Inertia::render('library/videos', [
            'videos'     => $videos,
            'categories' => $categories,
        ]);
    }

    /** Stream uploaded video file inline with HTTP Range support */
    public function stream(Video $video): StreamedResponse
    {
        if ($video->video_source !== 'upload' || ! $video->file_path || ! Storage::disk('public')->exists($video->file_path)) {
            abort(404);
        }

        $path     = Storage::disk('public')->path($video->file_path);
        $mimeType = mime_content_type($path) ?: 'video/mp4';
        $fileSize = filesize($path);
        $filename = basename($video->file_path);

        $rangeHeader = request()->header('Range');

        if ($rangeHeader && preg_match('/bytes=(\d*)-(\d*)/', $rangeHeader, $matches)) {
            $start  = $matches[1] !== '' ? (int) $matches[1] : 0;
            $end    = $matches[2] !== '' ? (int) $matches[2] : $fileSize - 1;
            $end    = min($end, $fileSize - 1);
            $start  = max(0, $start);

            if ($start > $end) {
                return response()->stream(function () { /* empty body */ }, 416, [
                    'Content-Range' => "bytes */{$fileSize}",
                ]);
            }

            $length = $end - $start + 1;

            return response()->stream(function () use ($path, $start, $length) {
                @set_time_limit(0);
                if (function_exists('ob_get_level')) {
                    while (ob_get_level() > 0) { @ob_end_clean(); }
                }
                $fp = fopen($path, 'rb');
                if (! $fp) return;
                fseek($fp, $start);
                $chunk = 1024 * 256; // 256 KiB
                $sent  = 0;
                while (! feof($fp) && $sent < $length && ! connection_aborted()) {
                    $read = min($chunk, $length - $sent);
                    echo fread($fp, $read);
                    $sent += $read;
                    @flush();
                }
                fclose($fp);
            }, 206, [
                'Content-Type'        => $mimeType,
                'Content-Range'       => "bytes {$start}-{$end}/{$fileSize}",
                'Content-Length'      => $length,
                'Accept-Ranges'       => 'bytes',
                'Content-Disposition' => 'inline; filename="' . $filename . '"',
                'Cache-Control'       => 'public, max-age=0',
            ]);
        }

        return response()->stream(function () use ($path) {
            @set_time_limit(0);
            if (function_exists('ob_get_level')) {
                while (ob_get_level() > 0) { @ob_end_clean(); }
            }
            $fp = fopen($path, 'rb');
            if (! $fp) return;
            while (! feof($fp) && ! connection_aborted()) {
                echo fread($fp, 1024 * 256);
                @flush();
            }
            fclose($fp);
        }, 200, [
            'Content-Type'        => $mimeType,
            'Content-Length'      => $fileSize,
            'Accept-Ranges'       => 'bytes',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
            'Cache-Control'       => 'public, max-age=0',
        ]);
    }

    /** Force-download uploaded video */
    public function download(Video $video): StreamedResponse
    {
        if ($video->video_source !== 'upload' || ! $video->file_path || ! Storage::disk('public')->exists($video->file_path)) {
            abort(404);
        }

        $locale   = app()->getLocale();
        $title    = $video->title[$locale] ?? $video->title['da'] ?? 'video';
        $ext      = pathinfo($video->file_path, PATHINFO_EXTENSION) ?: 'mp4';
        $filename = self::safeDownloadName($title, $ext, $video->id);

        $path     = Storage::disk('public')->path($video->file_path);
        $fileSize = filesize($path);
        $mimeType = mime_content_type($path) ?: 'application/octet-stream';

        return response()->streamDownload(function () use ($path) {
            @set_time_limit(0);
            if (function_exists('ob_get_level')) {
                while (ob_get_level() > 0) { @ob_end_clean(); }
            }
            $fp = fopen($path, 'rb');
            if (! $fp) return;
            while (! feof($fp) && ! connection_aborted()) {
                echo fread($fp, 1024 * 256);
                @flush();
            }
            fclose($fp);
        }, $filename, [
            'Content-Type'   => $mimeType,
            'Content-Length' => $fileSize,
            'Cache-Control'  => 'no-store',
        ]);
    }

    /**
     * Build a download filename that is non-empty and safe for HTTP headers
     * even when the title is Dari/Arabic (Str::slug would otherwise return '').
     */
    private static function safeDownloadName(string $title, string $ext, int $id): string
    {
        $slug = Str::slug($title, '-');
        if ($slug === '') {
            // Keep letters/digits/spaces/dashes/underscores; collapse the rest.
            $slug = preg_replace('/[\\\\\/\x00-\x1F\x7F<>:"|?*]+/u', '', $title) ?? '';
            $slug = preg_replace('/\s+/u', '-', trim($slug)) ?? '';
            $slug = trim($slug, '-');
        }
        if ($slug === '') {
            $slug = 'video-' . $id;
        }
        return mb_substr($slug, 0, 120) . '.' . $ext;
    }

    /** Admin listing */
    public function adminIndex(): Response
    {
        $locale = app()->getLocale();

        $videos = Video::with('category')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($v) => [
                'id'           => $v->id,
                'title'        => $v->title,
                'instructor'   => $v->instructor,
                'category_id'  => $v->category_id,
                'category'     => $v->category->name[$locale] ?? $v->category->name['da'] ?? '',
                'duration'     => $v->duration,
                'views'        => $v->views,
                'year'         => $v->year,
                'status'       => $v->status,
                'description'  => $v->description,
                'thumbnail'    => $v->thumbnail,
                'video_source' => $v->video_source ?? 'link',
                'video_url'    => $v->video_url,
                'file_path'    => $v->file_path,
                'file_size'    => $v->file_size,
                'is_active'    => $v->is_active,
                'created_at'   => $v->created_at->toDateTimeString(),
            ]);

        $categories = Category::where('type', 'video')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name, 'slug' => $c->slug, 'sort_order' => $c->sort_order]);

        return Inertia::render('admin/videos/index', [
            'videos'     => $videos,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateAndProcess($request);
        Video::create($data);
        return back();
    }

    public function update(Request $request, Video $video): RedirectResponse
    {
        $data = $this->validateAndProcess($request, $video);
        $video->update($data);
        return back();
    }

    public function destroy(Video $video): RedirectResponse
    {
        if ($video->file_path) {
            Storage::disk('public')->delete($video->file_path);
        }
        if ($video->thumbnail && !str_starts_with($video->thumbnail, 'http')) {
            Storage::disk('public')->delete($video->thumbnail);
        }
        $video->delete();
        return back();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function validateAndProcess(Request $request, ?Video $existing = null): array
    {
        $source = $request->input('video_source', 'link');

        $data = $request->validate([
            'title'        => ['required', 'array'],
            'title.da'     => ['required', 'string', 'max:255'],
            'title.en'     => ['nullable', 'string', 'max:255'],
            'title.ar'     => ['nullable', 'string', 'max:255'],
            'title.tg'     => ['nullable', 'string', 'max:255'],
            'instructor'   => ['required', 'string', 'max:255'],
            'category_id'  => ['required', 'exists:categories,id'],
            'duration'     => ['nullable', 'string', 'max:20'],
            'views'        => ['integer', 'min:0'],
            'year'         => ['nullable', 'integer'],
            'status'       => ['required', 'string', 'in:available,restricted,archived'],
            'description'     => ['nullable', 'array'],
            'description.en'  => ['nullable', 'string'],
            'description.ar'  => ['nullable', 'string'],
            'description.tg'  => ['nullable', 'string'],
            'video_source'   => ['required', 'string', 'in:link,youtube,upload'],
            'video_url'      => ['nullable', 'string', 'max:1000'],
            'is_active'      => ['boolean'],
            'file'           => ['nullable', 'file', 'max:1048576', 'mimes:mp4,webm,mov,avi,mkv'],
            'temp_file_path' => ['nullable', 'string', 'max:255'],
            'thumbnail'      => ['nullable', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
        ]);

        if ($source === 'upload' && $request->filled('temp_file_path')) {
            $moved = ChunkUploadController::consumeTempFile($request->input('temp_file_path'), 'videos');
            if (! $moved) {
                abort(422, 'Uploaded file is invalid or missing.');
            }
            if ($existing?->file_path) {
                Storage::disk('public')->delete($existing->file_path);
            }
            [$data['file_path'], $data['file_size']] = $moved;
            $data['video_url'] = null;
        } elseif ($source === 'upload' && $request->hasFile('file')) {
            // Legacy single-shot upload (kept for backwards compatibility).
            if ($existing?->file_path) {
                Storage::disk('public')->delete($existing->file_path);
            }
            $file = $request->file('file');
            $data['file_path'] = $file->store('videos', 'public');
            $data['file_size'] = $file->getSize();
            $data['video_url'] = null;
        } elseif ($source === 'upload') {
            // Source is upload but no new file — keep existing file.
            $data['file_path'] = $existing?->file_path;
            $data['file_size'] = $existing?->file_size;
            $data['video_url'] = null;
        } elseif ($source === 'youtube') {
            $data['file_path'] = null;
            $data['file_size'] = null;
            // Keep video_url as-is (the YouTube URL)
        } else {
            // link
            $data['file_path'] = null;
            $data['file_size'] = null;
        }

        if ($request->hasFile('thumbnail')) {
            if ($existing?->thumbnail && !str_starts_with($existing->thumbnail, 'http')) {
                Storage::disk('public')->delete($existing->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('thumbnails/videos', 'public');
        } else {
            unset($data['thumbnail']);
        }

        unset($data['file'], $data['temp_file_path']);
        return $data;
    }

    public static function extractYoutubeId(?string $url): ?string
    {
        if (! $url) return null;

        // youtu.be/ID
        if (preg_match('/youtu\.be\/([a-zA-Z0-9_\-]{11})/', $url, $m)) {
            return $m[1];
        }
        // youtube.com/watch?v=ID or /embed/ID or /shorts/ID
        if (preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_\-]{11})/', $url, $m)) {
            return $m[1];
        }

        return null;
    }
}
