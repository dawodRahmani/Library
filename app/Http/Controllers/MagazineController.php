<?php

namespace App\Http\Controllers;

use App\Models\Magazine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MagazineController extends Controller
{
    /** Public page */
    public function index(Request $request): Response
    {
        $query = Magazine::where('is_active', true)
            ->orderByDesc('created_at');

        if ($year = $request->query('year')) {
            $query->where('year', $year);
        }

        $magazines = $query->get()->map(fn ($m) => [
            'id'           => $m->id,
            'number'       => $m->number,
            'title'        => $m->title['da'] ?? '',
            'theme'        => $m->theme,
            'year'         => $m->year,
            'articleCount' => $m->article_count,
            'description'  => $m->description['da'] ?? '',
            'featured'     => $m->featured,
            'articles'     => $m->articles ?? [],
            'cover_image'  => $m->cover_image,
            'date'         => $m->created_at->format('Y-m-d'),
        ]);

        return Inertia::render('majalla', [
            'magazines' => $magazines,
        ]);
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
                'is_active'     => $m->is_active,
                'created_at'    => $m->created_at->toDateTimeString(),
            ]);

        return Inertia::render('admin/magazines/index', [
            'magazines' => $magazines,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'number'        => ['required', 'integer'],
            'title'         => ['required', 'array'],
            'title.da'      => ['required', 'string', 'max:255'],
            'theme'         => ['nullable', 'string', 'max:255'],
            'year'          => ['required', 'string', 'max:10'],
            'article_count' => ['integer', 'min:0'],
            'description'   => ['nullable', 'array'],
            'featured'      => ['boolean'],
            'articles'      => ['nullable', 'array'],
            'is_active'     => ['boolean'],
        ]);

        Magazine::create($data);

        return back();
    }

    public function update(Request $request, Magazine $magazine): RedirectResponse
    {
        $data = $request->validate([
            'number'        => ['required', 'integer'],
            'title'         => ['required', 'array'],
            'title.da'      => ['required', 'string', 'max:255'],
            'theme'         => ['nullable', 'string', 'max:255'],
            'year'          => ['required', 'string', 'max:10'],
            'article_count' => ['integer', 'min:0'],
            'description'   => ['nullable', 'array'],
            'featured'      => ['boolean'],
            'articles'      => ['nullable', 'array'],
            'is_active'     => ['boolean'],
        ]);

        $magazine->update($data);

        return back();
    }

    public function destroy(Magazine $magazine): RedirectResponse
    {
        $magazine->update(['is_active' => false]);

        return back();
    }
}
