<?php

namespace App\Http\Controllers;

use App\Models\Audio;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AudioController extends Controller
{
    /** Public page */
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        $query = Audio::with('category')
            ->where('is_active', true)
            ->orderByDesc('created_at');

        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        $audios = $query->get()->map(fn ($a) => [
            'id'           => $a->id,
            'title'        => $a->title[$locale] ?? $a->title['da'] ?? '',
            'description'  => $a->description[$locale] ?? $a->description['da'] ?? '',
            'author'       => $a->author,
            'category'     => $a->category->name[$locale] ?? $a->category->name['da'] ?? '',
            'categorySlug' => $a->category->slug,
            'duration'     => $a->duration,
            'episodes'     => $a->episodes,
            'audio_source' => $a->audio_source ?? 'link',
            'audio_url'    => $a->audio_url,
            'has_file'     => (bool) $a->file_path,
            'file_size'    => $a->file_size,
            'date'         => $a->created_at->format('Y-m-d'),
        ]);

        $categories = Category::where('type', 'audio')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name[$locale] ?? $c->name['da'] ?? '']);

        return Inertia::render('audio', [
            'audios'     => $audios,
            'categories' => $categories,
        ]);
    }

    /** Stream uploaded audio file inline (with Range request support for seeking) */
    public function stream(Audio $audio): \Illuminate\Http\Response|StreamedResponse
    {
        if ($audio->audio_source !== 'upload' || ! $audio->file_path || ! Storage::disk('public')->exists($audio->file_path)) {
            abort(404);
        }

        $path     = Storage::disk('public')->path($audio->file_path);
        $mimeType = mime_content_type($path) ?: 'audio/mpeg';
        $fileSize = filesize($path);
        $filename = basename($audio->file_path);

        $rangeHeader = request()->header('Range');

        if ($rangeHeader) {
            // Parse "bytes=start-end"
            preg_match('/bytes=(\d*)-(\d*)/', $rangeHeader, $matches);
            $start = $matches[1] !== '' ? (int) $matches[1] : 0;
            $end   = $matches[2] !== '' ? (int) $matches[2] : $fileSize - 1;
            $end   = min($end, $fileSize - 1);
            $length = $end - $start + 1;

            $fp = fopen($path, 'rb');
            fseek($fp, $start);

            return response()->stream(function () use ($fp, $length) {
                $chunk = 1024 * 64; // 64 KB
                $sent  = 0;
                while (! feof($fp) && $sent < $length) {
                    $read = min($chunk, $length - $sent);
                    echo fread($fp, $read);
                    $sent += $read;
                    flush();
                }
                fclose($fp);
            }, 206, [
                'Content-Type'   => $mimeType,
                'Content-Range'  => "bytes {$start}-{$end}/{$fileSize}",
                'Content-Length' => $length,
                'Accept-Ranges'  => 'bytes',
                'Content-Disposition' => 'inline; filename="' . $filename . '"',
            ]);
        }

        // Full response
        return response()->stream(function () use ($path) {
            readfile($path);
        }, 200, [
            'Content-Type'        => $mimeType,
            'Content-Length'      => $fileSize,
            'Accept-Ranges'       => 'bytes',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }

    /** Force-download uploaded audio */
    public function download(Audio $audio): StreamedResponse
    {
        if ($audio->audio_source !== 'upload' || ! $audio->file_path || ! Storage::disk('public')->exists($audio->file_path)) {
            abort(404);
        }

        $locale   = app()->getLocale();
        $title    = $audio->title[$locale] ?? $audio->title['da'] ?? 'audio';
        $ext      = pathinfo($audio->file_path, PATHINFO_EXTENSION);
        $filename = Str::slug($title) . '.' . $ext;

        return Storage::disk('public')->download($audio->file_path, $filename);
    }

    /** Admin CRUD */
    public function adminIndex(): Response
    {
        $locale = app()->getLocale();

        $audios = Audio::with('category')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($a) => [
                'id'           => $a->id,
                'title'        => $a->title,
                'description'  => $a->description,
                'author'       => $a->author,
                'category_id'  => $a->category_id,
                'category'     => $a->category->name[$locale] ?? $a->category->name['da'] ?? '',
                'duration'     => $a->duration,
                'episodes'     => $a->episodes,
                'audio_source' => $a->audio_source ?? 'link',
                'audio_url'    => $a->audio_url,
                'file_path'    => $a->file_path,
                'file_size'    => $a->file_size,
                'is_active'    => $a->is_active,
                'created_at'   => $a->created_at->toDateTimeString(),
            ]);

        $categories = Category::where('type', 'audio')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name, 'slug' => $c->slug, 'sort_order' => $c->sort_order]);

        return Inertia::render('admin/audios/index', [
            'audios'     => $audios,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateAndProcess($request);
        Audio::create($data);
        return back();
    }

    public function update(Request $request, Audio $audio): RedirectResponse
    {
        $data = $this->validateAndProcess($request, $audio);
        $audio->update($data);
        return back();
    }

    public function destroy(Audio $audio): RedirectResponse
    {
        $audio->update(['is_active' => false]);
        return back();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function validateAndProcess(Request $request, ?Audio $existing = null): array
    {
        $source = $request->input('audio_source', 'link');

        $data = $request->validate([
            'title'        => ['required', 'array'],
            'title.da'     => ['required', 'string', 'max:255'],
            'title.en'     => ['nullable', 'string', 'max:255'],
            'title.ar'     => ['nullable', 'string', 'max:255'],
            'description'  => ['nullable', 'array'],
            'description.en' => ['nullable', 'string'],
            'description.ar' => ['nullable', 'string'],
            'author'       => ['required', 'string', 'max:255'],
            'category_id'  => ['required', 'exists:categories,id'],
            'duration'     => ['nullable', 'string', 'max:20'],
            'episodes'     => ['nullable', 'integer', 'min:0'],
            'audio_source' => ['required', 'string', 'in:link,upload'],
            'audio_url'    => ['nullable', 'string', 'max:500'],
            'is_active'    => ['boolean'],
            'file'         => ['nullable', 'file', 'max:204800', 'mimes:mp3,m4a,ogg,wav,aac,flac,opus,wma'],
        ]);

        if ($source === 'upload' && $request->hasFile('file')) {
            if ($existing?->file_path) {
                Storage::disk('public')->delete($existing->file_path);
            }
            $file = $request->file('file');
            $data['file_path'] = $file->store('audios', 'public');
            $data['file_size'] = $file->getSize();
            $data['audio_url'] = null;
        } else {
            $data['file_path'] = $existing?->file_path;
            $data['file_size'] = $existing?->file_size;
        }

        unset($data['file']);
        return $data;
    }
}
