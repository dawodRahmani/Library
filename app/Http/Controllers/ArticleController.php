<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    /** Public page */
    public function index(Request $request): Response
    {
        $query = Article::with('category')
            ->where('is_active', true)
            ->orderByDesc('created_at');

        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        $articles = $query->get()->map(fn ($a) => [
            'id'           => $a->id,
            'title'        => $a->title['da'] ?? '',
            'slug'         => $a->slug,
            'excerpt'      => $a->excerpt['da'] ?? '',
            'author'       => $a->author,
            'category'     => $a->category->name['da'] ?? '',
            'categorySlug' => $a->category->slug,
            'readTime'     => $a->read_time,
            'date'         => $a->created_at->format('Y-m-d'),
        ]);

        $categories = Category::where('type', 'article')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name['da'] ?? '']);

        return Inertia::render('articles', [
            'articles'   => $articles,
            'categories' => $categories,
        ]);
    }

    /** Admin CRUD */
    public function adminIndex(): Response
    {
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
                'category'    => $a->category->name['da'] ?? '',
                'read_time'   => $a->read_time,
                'is_active'   => $a->is_active,
                'created_at'  => $a->created_at->toDateTimeString(),
            ]);

        $categories = Category::where('type', 'article')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]);

        return Inertia::render('admin/articles/index', [
            'articles'   => $articles,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'       => ['required', 'array'],
            'title.da'    => ['required', 'string', 'max:255'],
            'excerpt'     => ['nullable', 'array'],
            'content'     => ['nullable', 'array'],
            'author'      => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'read_time'   => ['nullable', 'string', 'max:50'],
            'is_active'   => ['boolean'],
        ]);

        $data['slug'] = Str::slug($data['title']['da'] ?? $data['title']['en'] ?? '');

        Article::create($data);

        return back();
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $data = $request->validate([
            'title'       => ['required', 'array'],
            'title.da'    => ['required', 'string', 'max:255'],
            'excerpt'     => ['nullable', 'array'],
            'content'     => ['nullable', 'array'],
            'author'      => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'read_time'   => ['nullable', 'string', 'max:50'],
            'is_active'   => ['boolean'],
        ]);

        $data['slug'] = Str::slug($data['title']['da'] ?? $data['title']['en'] ?? '');

        $article->update($data);

        return back();
    }

    public function destroy(Article $article): RedirectResponse
    {
        $article->update(['is_active' => false]);

        return back();
    }
}
