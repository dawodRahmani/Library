<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    /** Public page */
    public function index(Request $request): Response
    {
        $query = Book::with('category')
            ->where('is_active', true)
            ->orderByDesc('created_at');

        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        $books = $query->get()->map(fn ($b) => [
            'id'          => $b->id,
            'title'       => $b->title['da'] ?? '',
            'author'      => $b->author,
            'category'    => $b->category->name['da'] ?? '',
            'categorySlug' => $b->category->slug,
            'year'        => $b->year,
            'isbn'        => $b->isbn,
            'status'      => $b->status,
            'copies'      => $b->copies,
            'available'   => $b->available,
            'rating'      => $b->rating,
            'description' => $b->description['da'] ?? '',
            'pages'       => $b->pages,
            'publisher'   => $b->publisher,
            'cover_image' => $b->cover_image,
        ]);

        $categories = Category::where('type', 'book')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name['da'] ?? '']);

        return Inertia::render('library/index', [
            'books'      => $books,
            'categories' => $categories,
        ]);
    }

    /** Admin CRUD */
    public function adminIndex(): Response
    {
        $books = Book::with('category')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($b) => [
                'id'          => $b->id,
                'title'       => $b->title,
                'author'      => $b->author,
                'category_id' => $b->category_id,
                'category'    => $b->category->name['da'] ?? '',
                'year'        => $b->year,
                'isbn'        => $b->isbn,
                'status'      => $b->status,
                'copies'      => $b->copies,
                'available'   => $b->available,
                'rating'      => $b->rating,
                'description' => $b->description,
                'pages'       => $b->pages,
                'publisher'   => $b->publisher,
                'cover_image' => $b->cover_image,
                'is_active'   => $b->is_active,
                'created_at'  => $b->created_at->toDateTimeString(),
            ]);

        $categories = Category::where('type', 'book')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]);

        return Inertia::render('admin/books/index', [
            'books'      => $books,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'       => ['required', 'array'],
            'title.da'    => ['required', 'string', 'max:255'],
            'author'      => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'year'        => ['nullable', 'integer'],
            'isbn'        => ['nullable', 'string', 'max:50'],
            'status'      => ['required', 'string', 'in:available,borrowed,reserved'],
            'copies'      => ['integer', 'min:0'],
            'available'   => ['integer', 'min:0'],
            'rating'      => ['integer', 'min:0', 'max:5'],
            'description' => ['nullable', 'array'],
            'pages'       => ['nullable', 'integer'],
            'publisher'   => ['nullable', 'string', 'max:255'],
            'is_active'   => ['boolean'],
        ]);

        Book::create($data);

        return back();
    }

    public function update(Request $request, Book $book): RedirectResponse
    {
        $data = $request->validate([
            'title'       => ['required', 'array'],
            'title.da'    => ['required', 'string', 'max:255'],
            'author'      => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'year'        => ['nullable', 'integer'],
            'isbn'        => ['nullable', 'string', 'max:50'],
            'status'      => ['required', 'string', 'in:available,borrowed,reserved'],
            'copies'      => ['integer', 'min:0'],
            'available'   => ['integer', 'min:0'],
            'rating'      => ['integer', 'min:0', 'max:5'],
            'description' => ['nullable', 'array'],
            'pages'       => ['nullable', 'integer'],
            'publisher'   => ['nullable', 'string', 'max:255'],
            'is_active'   => ['boolean'],
        ]);

        $book->update($data);

        return back();
    }

    public function destroy(Book $book): RedirectResponse
    {
        $book->update(['is_active' => false]);

        return back();
    }
}
