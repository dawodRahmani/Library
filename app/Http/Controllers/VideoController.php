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

    /** Stream uploaded video file inline */
    public function stream(Video $video): StreamedResponse
    {
        if ($video->video_source !== 'upload' || ! $video->file_path || ! Storage::disk('public')->exists($video->file_path)) {
            abort(404);
        }

        $path     = Storage::disk('public')->path($video->file_path);
        $mimeType = mime_content_type($path) ?: 'video/mp4';
        $filename = basename($video->file_path);

        return response()->streamDownload(function () use ($path) {
            readfile($path);
        }, $filename, [
            'Content-Type'        => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
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
        $ext      = pathinfo($video->file_path, PATHINFO_EXTENSION);
        $filename = Str::slug($title) . '.' . $ext;

        return Storage::disk('public')->download($video->file_path, $filename);
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
        $video->update(['is_active' => false]);
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
            'video_source' => ['required', 'string', 'in:link,youtube,upload'],
            'video_url'    => ['nullable', 'string', 'max:1000'],
            'is_active'    => ['boolean'],
            'file'         => ['nullable', 'file', 'max:512000', 'mimes:mp4,webm,mov,avi,mkv'],
        ]);

        if ($source === 'upload' && $request->hasFile('file')) {
            // Delete old file if replacing
            if ($existing?->file_path) {
                Storage::disk('public')->delete($existing->file_path);
            }
            $file = $request->file('file');
            $data['file_path'] = $file->store('videos', 'public');
            $data['file_size'] = $file->getSize();
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

        unset($data['file']);
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
