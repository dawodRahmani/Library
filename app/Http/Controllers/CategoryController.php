<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::orderBy('type')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => [
                'id'         => $c->id,
                'name'       => $c->name,
                'slug'       => $c->slug,
                'type'       => $c->type,
                'sort_order' => $c->sort_order,
            ]);

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'       => ['required', 'array'],
            'name.da'    => ['required', 'string', 'max:255'],
            'name.en'    => ['nullable', 'string', 'max:255'],
            'name.ar'    => ['nullable', 'string', 'max:255'],
            'slug'       => ['required', 'string', 'max:255'],
            'type'       => ['required', 'string', 'in:book,video,audio,fatwa,article,magazine'],
            'sort_order' => ['integer'],
        ]);

        Category::create($data);

        return back();
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $data = $request->validate([
            'name'       => ['required', 'array'],
            'name.da'    => ['required', 'string', 'max:255'],
            'name.en'    => ['nullable', 'string', 'max:255'],
            'name.ar'    => ['nullable', 'string', 'max:255'],
            'slug'       => ['required', 'string', 'max:255'],
            'type'       => ['required', 'string', 'in:book,video,audio,fatwa,article,magazine'],
            'sort_order' => ['integer'],
        ]);

        $category->update($data);

        return back();
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return back();
    }
}
