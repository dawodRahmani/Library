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
        $categories = Category::withCount(['menuItems as items_count'])->orderBy('sort_order')->get();

        return Inertia::render('menu/categories', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'       => 'required|string|max:100',
            'sort_order' => 'integer|min:0',
        ]);

        Category::create($data);
        return back();
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $data = $request->validate([
            'name'       => 'required|string|max:100',
            'sort_order' => 'integer|min:0',
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
