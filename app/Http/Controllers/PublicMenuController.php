<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class PublicMenuController extends Controller
{
    public function index(): Response
    {
        $items      = MenuItem::with('category')->orderBy('sort_order')->get();
        $categories = Category::orderBy('sort_order')->get(['id', 'name', 'sort_order']);

        return Inertia::render('digital-menu/index', [
            'items'      => $this->serializeItems($items),
            'categories' => $categories,
        ]);
    }

    private function serializeItems(Collection $items): array
    {
        return $items->map(fn ($item) => [
            'id'          => $item->id,
            'category_id' => $item->category_id,
            'category'    => $item->category ? [
                'id'         => $item->category->id,
                'name'       => $item->category->name,
                'sort_order' => $item->category->sort_order,
            ] : null,
            'name'         => $item->name,
            'price'        => (float) $item->price,
            'image'        => $item->image,
            'is_available' => $item->is_available,
            'sort_order'   => $item->sort_order,
        ])->values()->toArray();
    }
}
