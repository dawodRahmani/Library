<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Fatwa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'title'        => $f->title[app()->getLocale()] ?? $f->title['da'] ?? '',
            'description'  => $f->description[app()->getLocale()] ?? $f->description['da'] ?? '',
            'author'       => $f->author,
            'thumbnail'    => $f->thumbnail,
            'category'     => $f->category->name[app()->getLocale()] ?? $f->category->name['da'] ?? '',
            'categorySlug' => $f->category->slug,
            'date'         => $f->created_at->format('Y-m-d'),
        ]);

        $categories = Category::where('type', 'fatwa')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name[app()->getLocale()] ?? $c->name['da'] ?? '']);

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
                'thumbnail'   => $f->thumbnail,
                'category_id' => $f->category_id,
                'category'    => $f->category->name[app()->getLocale()] ?? $f->category->name['da'] ?? '',
                'is_active'   => $f->is_active,
                'created_at'  => $f->created_at->toDateTimeString(),
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
        $data = $request->validate([
            'title'          => ['required', 'array'],
            'title.da'       => ['required', 'string', 'max:255'],
            'title.en'       => ['nullable', 'string', 'max:255'],
            'title.ar'       => ['nullable', 'string', 'max:255'],
            'title.tg'       => ['nullable', 'string', 'max:255'],
            'description'    => ['nullable', 'array'],
            'description.en' => ['nullable', 'string'],
            'description.ar' => ['nullable', 'string'],
            'description.tg' => ['nullable', 'string'],
            'author'         => ['required', 'string', 'max:255'],
            'category_id'    => ['required', 'exists:categories,id'],
            'is_active'      => ['boolean'],
            'thumbnail'      => ['nullable', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($existing?->thumbnail) {
                Storage::disk('public')->delete($existing->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('thumbnails/fatwas', 'public');
        } else {
            unset($data['thumbnail']);
        }

        return $data;
    }

    public function destroy(Fatwa $fatwa): RedirectResponse
    {
        if ($fatwa->thumbnail) {
            Storage::disk('public')->delete($fatwa->thumbnail);
        }
        $fatwa->delete();
        return back();
    }
}
