<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    /** Public listing */
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        $query = Article::with('category')
            ->where('is_active', true)
            ->orderByDesc('created_at');

        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        $articles = $query->get()->map(fn ($a) => [
            'id'           => $a->id,
            'title'        => $a->title[$locale] ?? $a->title['da'] ?? '',
            'slug'         => $a->slug,
            'excerpt'      => $a->excerpt[$locale] ?? $a->excerpt['da'] ?? '',
            'content'      => $a->content[$locale] ?? $a->content['da'] ?? '',
            'author'       => $a->author,
            'category'     => $a->category->name[$locale] ?? $a->category->name['da'] ?? '',
            'categorySlug' => $a->category->slug,
            'readTime'     => $a->read_time,
            'cover_image'  => $a->cover_image,
            'date'         => $a->created_at->format('Y-m-d'),
        ]);

        $categories = Category::where('type', 'article')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name[$locale] ?? $c->name['da'] ?? '']);

        return Inertia::render('articles', [
            'articles'   => $articles,
            'categories' => $categories,
        ]);
    }

    /** Admin listing */
    public function adminIndex(): Response
    {
        $locale = app()->getLocale();

        $articles = Article::with('category')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($a) => [
                'id'          => $a->id,
                'title'       => $a->title,
                'slug'        => $a->slug,
                'excerpt'     => $a->excerpt,
                'content'     => $a->content,
                'author'      => $a->author,
                'category_id' => $a->category_id,
                'category'    => $a->category->name[$locale] ?? $a->category->name['da'] ?? '',
                'read_time'   => $a->read_time,
                'cover_image' => $a->cover_image,
                'is_active'   => $a->is_active,
                'created_at'  => $a->created_at->toDateTimeString(),
            ]);

        $categories = Category::where('type', 'article')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name, 'slug' => $c->slug, 'sort_order' => $c->sort_order]);

        return Inertia::render('admin/articles/index', [
            'articles'   => $articles,
            'categories' => $categories,
        ]);
    }

    /** Show create form */
    public function create(): Response
    {
        $categories = Category::where('type', 'article')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name, 'slug' => $c->slug]);

        return Inertia::render('admin/articles/editor', [
            'article'    => null,
            'categories' => $categories,
        ]);
    }

    /** Show edit form */
    public function editForm(Article $article): Response
    {
        $categories = Category::where('type', 'article')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name, 'slug' => $c->slug]);

        return Inertia::render('admin/articles/editor', [
            'article'    => [
                'id'          => $article->id,
                'title'       => $article->title,
                'excerpt'     => $article->excerpt,
                'content'     => $article->content,
                'author'      => $article->author,
                'category_id' => $article->category_id,
                'read_time'   => $article->read_time,
                'cover_image' => $article->cover_image,
                'is_active'   => $article->is_active,
            ],
            'categories' => $categories,
        ]);
    }

    /** Inline image upload for Tiptap */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120', 'mimes:jpg,jpeg,png,gif,webp'],
        ]);

        $path = $request->file('image')->store('articles/images', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateAndProcess($request);
        $data['slug'] = Str::slug($data['title']['da'] ?? $data['title']['en'] ?? '');
        Article::create($data);
        return redirect()->route('admin.articles.index');
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $data = $this->validateAndProcess($request, $article);
        $data['slug'] = Str::slug($data['title']['da'] ?? $data['title']['en'] ?? '');
        $article->update($data);
        return redirect()->route('admin.articles.index');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $article->update(['is_active' => false]);
        return back();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function validateAndProcess(Request $request, ?Article $existing = null): array
    {
        $data = $request->validate([
            'title'        => ['required', 'array'],
            'title.da'     => ['required', 'string', 'max:255'],
            'title.en'     => ['nullable', 'string', 'max:255'],
            'title.ar'     => ['nullable', 'string', 'max:255'],
            'title.tg'     => ['nullable', 'string', 'max:255'],
            'excerpt'      => ['nullable', 'array'],
            'excerpt.en'   => ['nullable', 'string'],
            'excerpt.ar'   => ['nullable', 'string'],
            'excerpt.tg'   => ['nullable', 'string'],
            'content'      => ['nullable', 'array'],
            'content.en'   => ['nullable', 'string'],
            'content.ar'   => ['nullable', 'string'],
            'content.tg'   => ['nullable', 'string'],
            'author'       => ['required', 'string', 'max:255'],
            'category_id'  => ['required', 'exists:categories,id'],
            'read_time'    => ['nullable', 'string', 'max:50'],
            'is_active'    => ['boolean'],
            'cover_image'  => ['nullable', 'image', 'max:5120', 'mimes:jpg,jpeg,png,gif,webp'],
        ]);

        if ($request->hasFile('cover_image')) {
            if ($existing?->cover_image) {
                Storage::disk('public')->delete($existing->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('articles/covers', 'public');
        } else {
            $data['cover_image'] = $existing?->cover_image;
        }

        return $data;
    }
}
