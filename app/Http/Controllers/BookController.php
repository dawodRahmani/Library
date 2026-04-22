<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BookController extends Controller
{
    /** Public listing page */
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        $query = Book::with('category')
            ->where('is_active', true)
            ->orderByDesc('created_at');

        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        $books = $query->get()->map(fn ($b) => [
            'id'          => $b->id,
            'title'       => $b->title[$locale] ?? $b->title['da'] ?? '',
            'author'      => $b->author,
            'category'    => $b->category->name[$locale] ?? $b->category->name['da'] ?? '',
            'categorySlug' => $b->category->slug,
            'year'        => $b->year,
            'isbn'        => $b->isbn,
            'status'      => $b->status,
            'copies'      => $b->copies,
            'available'   => $b->available,
            'rating'      => $b->rating,
            'description' => $b->description[$locale] ?? $b->description['da'] ?? '',
            'pages'       => $b->pages,
            'publisher'   => $b->publisher,
            'cover_image' => $b->cover_image,
            'has_file'    => (bool) ($b->file_path || $b->file_url),
            'file_url'    => $b->file_url,
            'file_type'   => $b->file_type,
            'file_size'   => $b->file_size,
        ]);

        $categories = Category::where('type', 'book')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => [
                'slug' => $c->slug,
                'name' => $c->name[$locale] ?? $c->name['da'] ?? '',
            ]);

        return Inertia::render('library/index', [
            'books'      => $books,
            'categories' => $categories,
        ]);
    }

    /** Inertia reader page */
    public function reader(Book $book): Response|\Illuminate\Http\RedirectResponse
    {
        $locale = app()->getLocale();

        // No file at all
        if (! $book->file_url && (! $book->file_path || ! Storage::disk('public')->exists($book->file_path))) {
            abort(404);
        }

        return Inertia::render('library/book-reader', [
            'book' => [
                'id'           => $book->id,
                'title'        => $book->title[$locale] ?? $book->title['da'] ?? '',
                'author'       => $book->author,
                'file_type'    => $book->file_type,
                'is_external'  => (bool) $book->file_url,
                'read_url'     => $book->file_url ?? route('library.books.read', $book),
                'download_url' => route('library.books.download', $book),
            ],
        ]);
    }

    /** Open book for reading in-browser (inline) */
    public function read(Book $book): \Illuminate\Http\RedirectResponse|StreamedResponse
    {
        // External URL — open in browser tab
        if ($book->file_url) {
            return redirect()->away($book->file_url);
        }

        if (! $book->file_path || ! Storage::disk('public')->exists($book->file_path)) {
            abort(404);
        }

        $path     = Storage::disk('public')->path($book->file_path);
        $mimeType = mime_content_type($path) ?: 'application/pdf';
        $filename = basename($book->file_path);
        $size     = filesize($path);

        return response()->stream(function () use ($path) {
            readfile($path);
        }, 200, [
            'Content-Type'        => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
            'Content-Length'      => $size,
            'Cache-Control'       => 'public, max-age=3600',
        ]);
    }

    /** Force-download the book file */
    public function download(Book $book): StreamedResponse|\Illuminate\Http\RedirectResponse
    {
        $locale   = app()->getLocale();
        $title    = $book->title[$locale] ?? $book->title['da'] ?? 'book';

        // External URL — stream it through our server with attachment disposition
        if ($book->file_url) {
            $ext      = pathinfo(parse_url($book->file_url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'pdf';
            $filename = Str::slug($title) . '.' . $ext;
            $url      = $book->file_url;

            return response()->stream(function () use ($url) {
                $handle = @fopen($url, 'rb');
                if ($handle) {
                    while (! feof($handle)) {
                        echo fread($handle, 8192);
                        ob_flush();
                        flush();
                    }
                    fclose($handle);
                }
            }, 200, [
                'Content-Type'        => 'application/octet-stream',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                'Cache-Control'       => 'no-cache',
            ]);
        }

        if (! $book->file_path || ! Storage::disk('public')->exists($book->file_path)) {
            abort(404);
        }

        $ext      = pathinfo($book->file_path, PATHINFO_EXTENSION);
        $filename = Str::slug($title) . '.' . $ext;

        return Storage::disk('public')->download($book->file_path, $filename);
    }

    /** Admin listing */
    public function adminIndex(): Response
    {
        $locale = app()->getLocale();

        $books = Book::with('category')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($b) => [
                'id'          => $b->id,
                'title'       => $b->title,
                'author'      => $b->author,
                'category_id' => $b->category_id,
                'category'    => $b->category->name[$locale] ?? $b->category->name['da'] ?? '',
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
                'file_path'   => $b->file_path,
                'file_type'   => $b->file_type,
                'file_size'   => $b->file_size,
                'file_url'    => $b->file_url,
                'is_active'   => $b->is_active,
                'created_at'  => $b->created_at->toDateTimeString(),
            ]);

        $categories = Category::where('type', 'book')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name, 'slug' => $c->slug, 'sort_order' => $c->sort_order]);

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
            'title.en'    => ['nullable', 'string', 'max:255'],
            'title.ar'    => ['nullable', 'string', 'max:255'],
            'title.tg'    => ['nullable', 'string', 'max:255'],
            'author'      => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'year'        => ['nullable', 'integer'],
            'isbn'        => ['nullable', 'string', 'max:50'],
            'status'      => ['nullable', 'string', 'in:available,borrowed,reserved'],
            'copies'      => ['integer', 'min:0'],
            'available'   => ['integer', 'min:0'],
            'rating'      => ['integer', 'min:0', 'max:5'],
            'description' => ['nullable', 'array'],
            'description.en' => ['nullable', 'string'],
            'description.ar' => ['nullable', 'string'],
            'description.tg' => ['nullable', 'string'],
            'pages'       => ['nullable', 'integer'],
            'publisher'   => ['nullable', 'string', 'max:255'],
            'is_active'   => ['boolean'],
            'file_url'    => ['nullable', 'url', 'max:2048'],
            'file'        => ['nullable', 'file', 'max:51200', 'mimes:pdf,epub,doc,docx'],
            'cover_image' => ['nullable', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
        ]);

        if ($request->hasFile('file')) {
            $data = array_merge($data, $this->storeFile($request->file('file')));
        }
        unset($data['file']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('books/covers', 'public');
        } else {
            unset($data['cover_image']);
        }

        Book::create($data);

        return back();
    }

    public function update(Request $request, Book $book): RedirectResponse
    {
        $data = $request->validate([
            'title'          => ['required', 'array'],
            'title.da'       => ['required', 'string', 'max:255'],
            'title.en'       => ['nullable', 'string', 'max:255'],
            'title.ar'       => ['nullable', 'string', 'max:255'],
            'title.tg'       => ['nullable', 'string', 'max:255'],
            'author'         => ['required', 'string', 'max:255'],
            'category_id'    => ['required', 'exists:categories,id'],
            'year'           => ['nullable', 'integer'],
            'isbn'           => ['nullable', 'string', 'max:50'],
            'status'         => ['nullable', 'string', 'in:available,borrowed,reserved'],
            'copies'         => ['integer', 'min:0'],
            'available'      => ['integer', 'min:0'],
            'rating'         => ['integer', 'min:0', 'max:5'],
            'description'    => ['nullable', 'array'],
            'description.en' => ['nullable', 'string'],
            'description.ar' => ['nullable', 'string'],
            'description.tg' => ['nullable', 'string'],
            'pages'          => ['nullable', 'integer'],
            'publisher'      => ['nullable', 'string', 'max:255'],
            'is_active'      => ['boolean'],
            'file_url'       => ['nullable', 'url', 'max:2048'],
            'file'           => ['nullable', 'file', 'max:51200', 'mimes:pdf,epub,doc,docx'],
            'cover_image'    => ['nullable', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
        ]);

        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($book->file_path) {
                Storage::disk('public')->delete($book->file_path);
            }
            $data = array_merge($data, $this->storeFile($request->file('file')));
        }
        unset($data['file']);

        if ($request->hasFile('cover_image')) {
            if ($book->cover_image) {
                Storage::disk('public')->delete($book->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('books/covers', 'public');
        } else {
            unset($data['cover_image']);
        }

        $book->update($data);

        return back();
    }

    public function destroy(Book $book): RedirectResponse
    {
        if ($book->file_path) {
            Storage::disk('public')->delete($book->file_path);
        }
        if ($book->cover_image) {
            Storage::disk('public')->delete($book->cover_image);
        }
        $book->delete();
        return back();
    }

    /** Store uploaded file and return path/type/size array */
    private function storeFile(\Illuminate\Http\UploadedFile $file): array
    {
        $path = $file->store('books', 'public');

        return [
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
        ];
    }
}
