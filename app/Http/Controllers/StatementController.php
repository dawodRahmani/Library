<?php

namespace App\Http\Controllers;

use App\Models\Statement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StatementController extends Controller
{
    /** Public page */
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        $query = Statement::where('is_active', true)
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        if ($type = $request->query('type')) {
            if (in_array($type, ['text', 'audio', 'video'], true)) {
                $query->where('type', $type);
            }
        }

        $statements = $query->get()->map(fn ($s) => [
            'id'           => $s->id,
            'type'         => $s->type ?? 'text',
            'title'        => $s->title[$locale] ?? $s->title['da'] ?? '',
            'body'         => $s->body ? ($s->body[$locale] ?? $s->body['da'] ?? '') : '',
            'media_source' => $s->media_source,
            'media_url'    => $s->media_url,
            'has_file'     => (bool) $s->file_path,
            'file_size'    => $s->file_size,
            'thumbnail'    => $s->thumbnail,
            'published_at' => $s->published_at?->format('Y-m-d'),
        ]);

        return Inertia::render('bayania', [
            'statements' => $statements,
        ]);
    }

    /** Public single statement page */
    public function show(Statement $statement): Response
    {
        if (! $statement->is_active) {
            abort(404);
        }

        $locale = app()->getLocale();

        return Inertia::render('bayania-show', [
            'statement' => [
                'id'           => $statement->id,
                'type'         => $statement->type ?? 'text',
                'title'        => $statement->title[$locale] ?? $statement->title['da'] ?? '',
                'body'         => $statement->body ? ($statement->body[$locale] ?? $statement->body['da'] ?? '') : '',
                'media_source' => $statement->media_source,
                'media_url'    => $statement->media_url,
                'has_file'     => (bool) $statement->file_path,
                'stream_url'   => $statement->file_path ? route('bayania.stream', $statement) : null,
                'thumbnail'    => $statement->thumbnail,
                'published_at' => $statement->published_at?->format('Y-m-d'),
            ],
        ]);
    }

    /** Stream uploaded audio/video inline with Range support */
    public function stream(Statement $statement): \Illuminate\Http\Response|StreamedResponse
    {
        if (! $statement->file_path || ! Storage::disk('public')->exists($statement->file_path)) {
            abort(404);
        }

        $path     = Storage::disk('public')->path($statement->file_path);
        $mimeType = mime_content_type($path) ?: ($statement->type === 'video' ? 'video/mp4' : 'audio/mpeg');
        $fileSize = filesize($path);
        $filename = basename($statement->file_path);

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

    /** Admin create form */
    public function create(): Response
    {
        return Inertia::render('admin/statements/editor', ['statement' => null]);
    }

    /** Admin edit form */
    public function editForm(Statement $statement): Response
    {
        return Inertia::render('admin/statements/editor', [
            'statement' => [
                'id'           => $statement->id,
                'type'         => $statement->type ?? 'text',
                'title'        => $statement->title,
                'body'         => $statement->body,
                'media_source' => $statement->media_source ?? 'link',
                'media_url'    => $statement->media_url,
                'file_path'    => $statement->file_path,
                'file_size'    => $statement->file_size,
                'thumbnail'    => $statement->thumbnail,
                'published_at' => $statement->published_at?->format('Y-m-d'),
                'is_active'    => $statement->is_active,
            ],
        ]);
    }

    /** Admin list */
    public function adminIndex(): Response
    {
        $statements = Statement::orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($s) => [
                'id'           => $s->id,
                'type'         => $s->type ?? 'text',
                'title'        => $s->title,
                'body'         => $s->body,
                'media_source' => $s->media_source,
                'media_url'    => $s->media_url,
                'file_path'    => $s->file_path,
                'thumbnail'    => $s->thumbnail,
                'published_at' => $s->published_at?->format('Y-m-d'),
                'is_active'    => $s->is_active,
                'created_at'   => $s->created_at->toDateTimeString(),
            ]);

        return Inertia::render('admin/statements/index', [
            'statements' => $statements,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateAndProcess($request);
        Statement::create($data);

        return redirect()->route('admin.statements.index')->with('success', 'بیانیه با موفقیت اضافه شد.');
    }

    public function update(Request $request, Statement $statement): RedirectResponse
    {
        $data = $this->validateAndProcess($request, $statement);
        $statement->update($data);

        return redirect()->route('admin.statements.index')->with('success', 'بیانیه با موفقیت ویرایش شد.');
    }

    public function destroy(Statement $statement): RedirectResponse
    {
        if ($statement->file_path) {
            Storage::disk('public')->delete($statement->file_path);
        }
        if ($statement->thumbnail) {
            Storage::disk('public')->delete($statement->thumbnail);
        }
        $statement->delete();

        return back()->with('success', 'بیانیه حذف شد.');
    }

    private function validateAndProcess(Request $request, ?Statement $existing = null): array
    {
        $type = $request->input('type', 'text');
        if (! in_array($type, ['text', 'audio', 'video'], true)) {
            $type = 'text';
        }

        $data = $request->validate([
            'type'           => ['required', 'string', 'in:text,audio,video'],
            'title'          => ['required', 'array'],
            'title.da'       => ['required', 'string', 'max:500'],
            'title.en'       => ['nullable', 'string', 'max:500'],
            'title.ar'       => ['nullable', 'string', 'max:500'],
            'title.tg'       => ['nullable', 'string', 'max:500'],
            'body'           => ['nullable', 'array'],
            'body.da'        => ['nullable', 'string'],
            'body.en'        => ['nullable', 'string'],
            'body.ar'        => ['nullable', 'string'],
            'body.tg'        => ['nullable', 'string'],
            'media_source'   => ['nullable', 'string', 'in:link,upload'],
            'media_url'      => ['nullable', 'string', 'max:1000'],
            'file'           => ['nullable', 'file', 'max:512000'],
            'thumbnail'      => ['nullable', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
            'published_at'   => ['nullable', 'date'],
            'is_active'      => ['boolean'],
        ]);

        // For text type, clear media fields
        if ($type === 'text') {
            if ($existing?->file_path) {
                Storage::disk('public')->delete($existing->file_path);
            }
            if ($existing?->thumbnail) {
                Storage::disk('public')->delete($existing->thumbnail);
            }
            $data['media_source'] = 'link';
            $data['media_url']    = null;
            $data['file_path']    = null;
            $data['file_size']    = null;
            $data['thumbnail']    = null;
            unset($data['file']);
            return $data;
        }

        $source = $data['media_source'] ?? 'link';

        if ($source === 'upload' && $request->hasFile('file')) {
            if ($existing?->file_path) {
                Storage::disk('public')->delete($existing->file_path);
            }
            $file = $request->file('file');
            $dir  = $type === 'video' ? 'statements/videos' : 'statements/audios';
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

        // Thumbnail (video only, but allow for audio too)
        if ($request->hasFile('thumbnail')) {
            if ($existing?->thumbnail) {
                Storage::disk('public')->delete($existing->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('statements/thumbnails', 'public');
        } else {
            $data['thumbnail'] = $existing?->thumbnail;
        }

        unset($data['file']);
        return $data;
    }
}
