<?php

namespace App\Http\Controllers;

use App\Events\MenuAvailabilityChanged;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuItemController extends Controller
{
    public function index(): Response
    {
        $categories = Category::orderBy('sort_order')->get();
        $items = MenuItem::with('category')->orderBy('category_id')->orderBy('sort_order')->get()
            ->map(fn($item) => [
                'id'           => $item->id,
                'category_id'  => $item->category_id,
                'category'     => ['id' => $item->category->id, 'name' => $item->category->name, 'sort_order' => $item->category->sort_order],
                'name'         => $item->name,
                'price'        => $item->price,
                'image'        => $item->image,
                'is_available' => $item->is_available,
                'sort_order'   => $item->sort_order,
            ]);

        return Inertia::render('menu/index', [
            'categories' => $categories,
            'items'      => $items,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'category_id'  => 'required|exists:categories,id',
            'name'         => 'required|string|max:100',
            'price'        => 'required|integer|min:0',
            'image'        => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'is_available' => 'boolean',
            'sort_order'   => 'integer|min:0',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = '/storage/' . $request->file('image')->store('food-images', 'public');
        }

        MenuItem::create($data);
        return back();
    }

    public function update(Request $request, MenuItem $menuItem): RedirectResponse
    {
        $data = $request->validate([
            'category_id'  => 'required|exists:categories,id',
            'name'         => 'required|string|max:100',
            'price'        => 'required|integer|min:0',
            'image'        => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'is_available' => 'boolean',
            'sort_order'   => 'integer|min:0',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = '/storage/' . $request->file('image')->store('food-images', 'public');
        } else {
            unset($data['image']);
        }

        $menuItem->update($data);
        return back();
    }

    public function destroy(MenuItem $menuItem): RedirectResponse
    {
        $menuItem->delete();
        return back();
    }

    public function toggleAvailability(MenuItem $menuItem): RedirectResponse
    {
        $menuItem->update(['is_available' => ! $menuItem->is_available]);

        try {
            broadcast(new MenuAvailabilityChanged($menuItem->id, (bool) $menuItem->is_available))->toOthers();
        } catch (\Throwable) {
            // Broadcasting is optional
        }

        return back();
    }
}
