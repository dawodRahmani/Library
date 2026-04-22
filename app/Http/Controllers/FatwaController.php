<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Fatwa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FatwaController extends Controller
{
    /** Public page */
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        $query = Fatwa::with('category')
            ->where('is_active', true)
            ->orderByDesc('created_at');

        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }
        // Note: `type` filter is applied client-side so the type-filter tabs
        // remain switchable without a full-page reload.

        $fatwas = $query->get()->map(fn ($f) => [
            'id'           => $f->id,
            'title'        => $f->title[$locale] ?? $f->title['da'] ?? '',
            'description'  => $f->description ? ($f->description[$locale] ?? $f->description['da'] ?? '') : '',
            'body'         => $f->body ? ($f->body[$locale] ?? $f->body['da'] ?? '') : '',
            'author'       => $f->author,
            'thumbnail'    => $f->thumbnail,
            'category'     => $f->category->name[$locale] ?? $f->category->name['da'] ?? '',
            'categorySlug' => $f->category->slug,
            'type'         => $f->type ?? 'text',
            'media_source' => $f->media_source,
            'media_url'    => $f->media_url,
            'has_file'     => (bool) $f->file_path,
            'stream_url'   => $f->file_path ? route('fatwas.stream', $f) : null,
            'file_size'    => $f->file_size,
            'date'         => $f->created_at->format('Y-m-d'),
        ]);

        $categories = Category::where('type', 'fatwa')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name[$locale] ?? $c->name['da'] ?? '']);

        return Inertia::render('dar-ul-ifta', [
            'fatwas'     => $fatwas,
            'categories' => $categories,
        ]);
    }

    /** Stream uploaded audio/video inline with Range support */
    public function stream(Fatwa $fatwa): \Illuminate\Http\Response|StreamedResponse
    {
        if (! $fatwa->file_path || ! Storage::disk('public')->exists($fatwa->file_path)) {
            abort(404);
        }

        $path     = Storage::disk('public')->path($fatwa->file_path);
        $mimeType = mime_content_type($path) ?: ($fatwa->type === 'video' ? 'video/mp4' : 'audio/mpeg');
        $fileSize = filesize($path);
        $filename = basename($fatwa->file_path);

        $rangeHeader = request()->header('Range');

        if ($rangeHeader) {
            preg_match('/bytes=(\d*)-(\d*)/', $rangeHeader, $matches);
            $start  = $matches[1] !== '' ? (int) $matches[1] : 0;
            $end    = $matches[2] !== '' ? (int) $matches[2] : $fileSize - 1;
            $end    = min($end, $fileSize - 1);
            $length = $end - $start + 1;

            $fp = fopen($path, 'rb');
            fseek($fp, $start);

            return response()->stream(function () use ($fp, $length) {
                $chunk = 1024 * 64;
                $sent  = 0;
                while (! feof($fp) && $sent < $length) {
                    $read = min($chunk, $length - $sent);
                    echo fread($fp, $read);
                    $sent += $read;
                    flush();
                }
                fclose($fp);
            }, 206, [
                'Content-Type'        => $mimeType,
                'Content-Range'       => "bytes {$start}-{$end}/{$fileSize}",
                'Content-Length'      => $length,
                'Accept-Ranges'       => 'bytes',
                'Content-Disposition' => 'inline; filename="' . $filename . '"',
            ]);
        }

        return response()->stream(function () use ($path) {
            readfile($path);
        }, 200, [
            'Content-Type'        => $mimeType,
            'Content-Length'      => $fileSize,
            'Accept-Ranges'       => 'bytes',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }

    /** Admin CRUD */
    public function adminIndex(): Response
    {
        $locale = app()->getLocale();

        $fatwas = Fatwa::with('category')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($f) => [
                'id'           => $f->id,
                'title'        => $f->title,
                'description'  => $f->description,
                'body'         => $f->body,
                'author'       => $f->author,
                'thumbnail'    => $f->thumbnail,
                'category_id'  => $f->category_id,
                'category'     => $f->category->name[$locale] ?? $f->category->name['da'] ?? '',
                'type'         => $f->type ?? 'text',
                'media_source' => $f->media_source,
                'media_url'    => $f->media_url,
                'file_path'    => $f->file_path,
                'file_size'    => $f->file_size,
                'is_active'    => $f->is_active,
                'created_at'   => $f->created_at->toDateTimeString(),
            ]);

        $categories = Category::where('type', 'fatwa')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name, 'slug' => $c->slug, 'sort_order' => $c->sort_order]);

        return Inertia::render('admin/fatwas/index', [
            'fatwas'     => $fatwas,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateAndProcess($request);
        Fatwa::create($data);
        return back();
    }

    public function update(Request $request, Fatwa $fatwa): RedirectResponse
    {
        $data = $this->validateAndProcess($request, $fatwa);
        $fatwa->update($data);
        return back();
    }

    private function validateAndProcess(Request $request, ?Fatwa $existing = null): array
    {
        $type = $request->input('type', 'text');
        if (! in_array($type, ['text', 'audio', 'video'], true)) {
            $type = 'text';
        }

        $data = $request->validate([
            'title'          => ['required', 'array'],
            'title.da'       => ['required', 'string', 'max:255'],
            'title.en'       => ['nullable', 'string', 'max:255'],
            'title.ar'       => ['nullable', 'string', 'max:255'],
            'title.tg'       => ['nullable', 'string', 'max:255'],
            'description'    => ['nullable', 'array'],
            'description.da' => ['nullable', 'string'],
            'description.en' => ['nullable', 'string'],
            'description.ar' => ['nullable', 'string'],
            'description.tg' => ['nullable', 'string'],
            'body'           => ['nullable', 'array'],
            'body.da'        => ['nullable', 'string'],
            'body.en'        => ['nullable', 'string'],
            'body.ar'        => ['nullable', 'string'],
            'body.tg'        => ['nullable', 'string'],
            'author'         => ['required', 'string', 'max:255'],
            'category_id'    => ['required', 'exists:categories,id'],
            'type'           => ['required', 'string', 'in:text,audio,video'],
            'media_source'   => ['nullable', 'string', 'in:link,upload'],
            'media_url'      => ['nullable', 'string', 'max:1000'],
            'file'           => ['nullable', 'file', 'max:512000'],
            'is_active'      => ['boolean'],
            'thumbnail'      => ['nullable', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
        ]);

        // For text type, clear media fields (keep thumbnail + body)
        if ($type === 'text') {
            if ($existing?->file_path) {
                Storage::disk('public')->delete($existing->file_path);
            }
            $data['media_source'] = null;
            $data['media_url']    = null;
            $data['file_path']    = null;
            $data['file_size']    = null;
        } else {
            $source = $data['media_source'] ?? 'link';

            if ($source === 'upload' && $request->hasFile('file')) {
                if ($existing?->file_path) {
                    Storage::disk('public')->delete($existing->file_path);
                }
                $file = $request->file('file');
                $dir  = $type === 'video' ? 'fatwas/videos' : 'fatwas/audios';
                $data['file_path'] = $file->store($dir, 'public');
                $data['file_size'] = $file->getSize();
                $data['media_url'] = null;
            } elseif ($source === 'upload') {
                $data['file_path'] = $existing?->file_path;
                $data['file_size'] = $existing?->file_size;
            } else {
                // link — clear any stored file
                if ($existing?->file_path) {
                    Storage::disk('public')->delete($existing->file_path);
                }
                $data['file_path'] = null;
                $data['file_size'] = null;
            }
        }

        // Thumbnail
        if ($request->hasFile('thumbnail')) {
            if ($existing?->thumbnail) {
                Storage::disk('public')->delete($existing->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('thumbnails/fatwas', 'public');
        } else {
            $data['thumbnail'] = $existing?->thumbnail;
        }

        unset($data['file']);
        return $data;
    }

    public function destroy(Fatwa $fatwa): RedirectResponse
    {
        if ($fatwa->thumbnail) {
            Storage::disk('public')->delete($fatwa->thumbnail);
        }
        if ($fatwa->file_path) {
            Storage::disk('public')->delete($fatwa->file_path);
        }
        $fatwa->delete();
        return back();
    }
}
