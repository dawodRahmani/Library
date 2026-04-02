<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Fatwa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FatwaController extends Controller
{
    /** Public page */
    public function index(Request $request): Response
    {
        $query = Fatwa::with('category')
            ->where('is_active', true)
            ->orderByDesc('created_at');

        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        $fatwas = $query->get()->map(fn ($f) => [
            'id'           => $f->id,
            'title'        => $f->title['da'] ?? '',
            'description'  => $f->description['da'] ?? '',
            'author'       => $f->author,
            'category'     => $f->category->name['da'] ?? '',
            'categorySlug' => $f->category->slug,
            'date'         => $f->created_at->format('Y-m-d'),
        ]);

        $categories = Category::where('type', 'fatwa')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name['da'] ?? '']);

        return Inertia::render('dar-ul-ifta', [
            'fatwas'     => $fatwas,
            'categories' => $categories,
        ]);
    }

    /** Admin CRUD */
    public function adminIndex(): Response
    {
        $fatwas = Fatwa::with('category')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($f) => [
                'id'          => $f->id,
                'title'       => $f->title,
                'description' => $f->description,
                'author'      => $f->author,
                'category_id' => $f->category_id,
                'category'    => $f->category->name['da'] ?? '',
                'is_active'   => $f->is_active,
                'created_at'  => $f->created_at->toDateTimeString(),
            ]);

        $categories = Category::where('type', 'fatwa')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]);

        return Inertia::render('admin/fatwas/index', [
            'fatwas'     => $fatwas,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'       => ['required', 'array'],
            'title.da'    => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'array'],
            'author'      => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'is_active'   => ['boolean'],
        ]);

        Fatwa::create($data);

        return back();
    }

    public function update(Request $request, Fatwa $fatwa): RedirectResponse
    {
        $data = $request->validate([
            'title'       => ['required', 'array'],
            'title.da'    => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'array'],
            'author'      => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'is_active'   => ['boolean'],
        ]);

        $fatwa->update($data);

        return back();
    }

    public function destroy(Fatwa $fatwa): RedirectResponse
    {
        $fatwa->update(['is_active' => false]);

        return back();
    }
}
