<?php

namespace App\Http\Controllers;

use App\Models\Audio;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AudioController extends Controller
{
    /** Public page */
    public function index(Request $request): Response
    {
        $query = Audio::with('category')
            ->where('is_active', true)
            ->orderByDesc('created_at');

        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        $audios = $query->get()->map(fn ($a) => [
            'id'           => $a->id,
            'title'        => $a->title['da'] ?? '',
            'description'  => $a->description['da'] ?? '',
            'author'       => $a->author,
            'category'     => $a->category->name['da'] ?? '',
            'categorySlug' => $a->category->slug,
            'duration'     => $a->duration,
            'episodes'     => $a->episodes,
            'audio_url'    => $a->audio_url,
            'date'         => $a->created_at->format('Y-m-d'),
        ]);

        $categories = Category::where('type', 'audio')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name['da'] ?? '']);

        return Inertia::render('audio', [
            'audios'     => $audios,
            'categories' => $categories,
        ]);
    }

    /** Admin CRUD */
    public function adminIndex(): Response
    {
        $audios = Audio::with('category')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($a) => [
                'id'          => $a->id,
                'title'       => $a->title,
                'description' => $a->description,
                'author'      => $a->author,
                'category_id' => $a->category_id,
                'category'    => $a->category->name['da'] ?? '',
                'duration'    => $a->duration,
                'episodes'    => $a->episodes,
                'audio_url'   => $a->audio_url,
                'is_active'   => $a->is_active,
                'created_at'  => $a->created_at->toDateTimeString(),
            ]);

        $categories = Category::where('type', 'audio')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]);

        return Inertia::render('admin/audios/index', [
            'audios'     => $audios,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'       => ['required', 'array'],
            'title.da'    => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'array'],
            'author'      => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'duration'    => ['nullable', 'string', 'max:20'],
            'episodes'    => ['nullable', 'integer', 'min:0'],
            'audio_url'   => ['nullable', 'string', 'max:500'],
            'is_active'   => ['boolean'],
        ]);

        Audio::create($data);

        return back();
    }

    public function update(Request $request, Audio $audio): RedirectResponse
    {
        $data = $request->validate([
            'title'       => ['required', 'array'],
            'title.da'    => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'array'],
            'author'      => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'duration'    => ['nullable', 'string', 'max:20'],
            'episodes'    => ['nullable', 'integer', 'min:0'],
            'audio_url'   => ['nullable', 'string', 'max:500'],
            'is_active'   => ['boolean'],
        ]);

        $audio->update($data);

        return back();
    }

    public function destroy(Audio $audio): RedirectResponse
    {
        $audio->update(['is_active' => false]);

        return back();
    }
}
