<?php

namespace App\Http\Controllers;

use App\Models\Statement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StatementController extends Controller
{
    /** Public page */
    public function index(): Response
    {
        $locale = app()->getLocale();

        $statements = Statement::where('is_active', true)
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($s) => [
                'id'           => $s->id,
                'title'        => $s->title[$locale] ?? $s->title['da'] ?? '',
                'body'         => $s->body ? ($s->body[$locale] ?? $s->body['da'] ?? '') : '',
                'published_at' => $s->published_at?->format('Y-m-d'),
            ]);

        return Inertia::render('bayania', [
            'statements' => $statements,
        ]);
    }

    /** Admin create form */
    public function create(): Response
    {
        return Inertia::render('admin/statements/editor', ['statement' => null]);
    }

    /** Admin edit form */
    public function editForm(Statement $statement): Response
    {
        return Inertia::render('admin/statements/editor', [
            'statement' => [
                'id'           => $statement->id,
                'title'        => $statement->title,
                'body'         => $statement->body,
                'published_at' => $statement->published_at?->format('Y-m-d'),
                'is_active'    => $statement->is_active,
            ],
        ]);
    }

    /** Admin list */
    public function adminIndex(): Response
    {
        $statements = Statement::orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($s) => [
                'id'           => $s->id,
                'title'        => $s->title,
                'body'         => $s->body,
                'published_at' => $s->published_at?->format('Y-m-d'),
                'is_active'    => $s->is_active,
                'created_at'   => $s->created_at->toDateTimeString(),
            ]);

        return Inertia::render('admin/statements/index', [
            'statements' => $statements,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'        => ['required', 'array'],
            'title.da'     => ['required', 'string', 'max:500'],
            'title.en'     => ['nullable', 'string', 'max:500'],
            'body'         => ['nullable', 'array'],
            'body.da'      => ['nullable', 'string'],
            'body.en'      => ['nullable', 'string'],
            'published_at' => ['nullable', 'date'],
            'is_active'    => ['boolean'],
        ]);

        Statement::create($data);

        return back()->with('success', 'بیانیه با موفقیت اضافه شد.');
    }

    public function update(Request $request, Statement $statement): RedirectResponse
    {
        $data = $request->validate([
            'title'        => ['required', 'array'],
            'title.da'     => ['required', 'string', 'max:500'],
            'title.en'     => ['nullable', 'string', 'max:500'],
            'body'         => ['nullable', 'array'],
            'body.da'      => ['nullable', 'string'],
            'body.en'      => ['nullable', 'string'],
            'published_at' => ['nullable', 'date'],
            'is_active'    => ['boolean'],
        ]);

        $statement->update($data);

        return back()->with('success', 'بیانیه با موفقیت ویرایش شد.');
    }

    public function destroy(Statement $statement): RedirectResponse
    {
        $statement->delete();

        return back()->with('success', 'بیانیه حذف شد.');
    }
}
