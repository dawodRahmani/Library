<?php

namespace App\Http\Controllers;

use App\Models\Magazine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MagazineController extends Controller
{
    /** Public page */
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        $query = Magazine::where('is_active', true)
            ->orderByDesc('created_at');

        if ($year = $request->query('year')) {
            $query->where('year', $year);
        }

        $magazines = $query->get()->map(fn ($m) => [
            'id'           => $m->id,
            'number'       => $m->number,
            'title'        => $m->title[$locale] ?? $m->title['da'] ?? '',
            'theme'        => $m->theme,
            'year'         => $m->year,
            'articleCount' => $m->article_count,
            'description'  => $m->description[$locale] ?? $m->description['da'] ?? '',
            'featured'     => $m->featured,
            'articles'     => $m->articles ?? [],
            'cover_image'  => $m->cover_image,
            'has_file'     => (bool) $m->file_path,
            'file_size'    => $m->file_size,
            'date'         => $m->created_at->format('Y-m-d'),
        ]);

        return Inertia::render('majalla', [
            'magazines' => $magazines,
        ]);
    }

    /** Stream PDF inline */
    public function read(Magazine $magazine): StreamedResponse
    {
        if (! $magazine->file_path || ! Storage::disk('public')->exists($magazine->file_path)) {
            abort(404);
        }

        $path     = Storage::disk('public')->path($magazine->file_path);
        $filename = basename($magazine->file_path);

        return response()->streamDownload(function () use ($path) {
            readfile($path);
        }, $filename, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }

    /** Force-download PDF */
    public function download(Magazine $magazine): StreamedResponse
    {
        if (! $magazine->file_path || ! Storage::disk('public')->exists($magazine->file_path)) {
            abort(404);
        }

        $locale   = app()->getLocale();
        $title    = $magazine->title[$locale] ?? $magazine->title['da'] ?? 'magazine';
        $filename = 'majalla-' . $magazine->number . '-' . Str::slug($title) . '.pdf';

        return Storage::disk('public')->download($magazine->file_path, $filename);
    }

    /** Admin CRUD */
    public function adminIndex(): Response
    {
        $magazines = Magazine::orderByDesc('created_at')
            ->get()
            ->map(fn ($m) => [
                'id'            => $m->id,
                'number'        => $m->number,
                'title'         => $m->title,
                'theme'         => $m->theme,
                'year'          => $m->year,
                'article_count' => $m->article_count,
                'description'   => $m->description,
                'featured'      => $m->featured,
                'articles'      => $m->articles,
                'cover_image'   => $m->cover_image,
                'file_path'     => $m->file_path,
                'file_size'     => $m->file_size,
                'is_active'     => $m->is_active,
                'created_at'    => $m->created_at->toDateTimeString(),
            ]);

        return Inertia::render('admin/magazines/index', [
            'magazines' => $magazines,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateAndProcess($request);
        Magazine::create($data);
        return back();
    }

    public function update(Request $request, Magazine $magazine): RedirectResponse
    {
        $data = $this->validateAndProcess($request, $magazine);
        $magazine->update($data);
        return back();
    }

    public function destroy(Magazine $magazine): RedirectResponse
    {
        $magazine->update(['is_active' => false]);
        return back();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function validateAndProcess(Request $request, ?Magazine $existing = null): array
    {
        $data = $request->validate([
            'number'         => ['required', 'integer'],
            'title'          => ['required', 'array'],
            'title.da'       => ['required', 'string', 'max:255'],
            'title.en'       => ['nullable', 'string', 'max:255'],
            'title.ar'       => ['nullable', 'string', 'max:255'],
            'theme'          => ['nullable', 'string', 'max:255'],
            'year'           => ['required', 'string', 'max:10'],
            'article_count'  => ['integer', 'min:0'],
            'description'    => ['nullable', 'array'],
            'description.en' => ['nullable', 'string'],
            'description.ar' => ['nullable', 'string'],
            'featured'      => ['boolean'],
            'articles'      => ['nullable', 'array'],
            'is_active'     => ['boolean'],
            'file'          => ['nullable', 'file', 'max:51200', 'mimes:pdf'],
        ]);

        if ($request->hasFile('file')) {
            if ($existing?->file_path) {
                Storage::disk('public')->delete($existing->file_path);
            }
            $file = $request->file('file');
            $data['file_path'] = $file->store('magazines', 'public');
            $data['file_size'] = $file->getSize();
        } else {
            $data['file_path'] = $existing?->file_path;
            $data['file_size'] = $existing?->file_size;
        }

        unset($data['file']);
        return $data;
    }
}
