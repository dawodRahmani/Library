<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Video;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    /** Public page */
    public function index(Request $request): Response
    {
        $query = Video::with('category')
            ->where('is_active', true)
            ->orderByDesc('created_at');

        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        $videos = $query->get()->map(fn ($v) => [
            'id'           => $v->id,
            'title'        => $v->title['da'] ?? '',
            'instructor'   => $v->instructor,
            'category'     => $v->category->name['da'] ?? '',
            'categorySlug' => $v->category->slug,
            'duration'     => $v->duration,
            'views'        => $v->views,
            'year'         => $v->year,
            'status'       => $v->status,
            'description'  => $v->description['da'] ?? '',
            'thumbnail'    => $v->thumbnail,
            'video_url'    => $v->video_url,
        ]);

        $categories = Category::where('type', 'video')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name['da'] ?? '']);

        return Inertia::render('library/videos', [
            'videos'     => $videos,
            'categories' => $categories,
        ]);
    }

    /** Admin CRUD */
    public function adminIndex(): Response
    {
        $videos = Video::with('category')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($v) => [
                'id'          => $v->id,
                'title'       => $v->title,
                'instructor'  => $v->instructor,
                'category_id' => $v->category_id,
                'category'    => $v->category->name['da'] ?? '',
                'duration'    => $v->duration,
                'views'       => $v->views,
                'year'        => $v->year,
                'status'      => $v->status,
                'description' => $v->description,
                'thumbnail'   => $v->thumbnail,
                'video_url'   => $v->video_url,
                'is_active'   => $v->is_active,
                'created_at'  => $v->created_at->toDateTimeString(),
            ]);

        $categories = Category::where('type', 'video')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]);

        return Inertia::render('admin/videos/index', [
            'videos'     => $videos,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'       => ['required', 'array'],
            'title.da'    => ['required', 'string', 'max:255'],
            'instructor'  => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'duration'    => ['nullable', 'string', 'max:20'],
            'views'       => ['integer', 'min:0'],
            'year'        => ['nullable', 'integer'],
            'status'      => ['required', 'string', 'in:available,restricted,archived'],
            'description' => ['nullable', 'array'],
            'video_url'   => ['nullable', 'string', 'max:500'],
            'is_active'   => ['boolean'],
        ]);

        Video::create($data);

        return back();
    }

    public function update(Request $request, Video $video): RedirectResponse
    {
        $data = $request->validate([
            'title'       => ['required', 'array'],
            'title.da'    => ['required', 'string', 'max:255'],
            'instructor'  => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'duration'    => ['nullable', 'string', 'max:20'],
            'views'       => ['integer', 'min:0'],
            'year'        => ['nullable', 'integer'],
            'status'      => ['required', 'string', 'in:available,restricted,archived'],
            'description' => ['nullable', 'array'],
            'video_url'   => ['nullable', 'string', 'max:500'],
            'is_active'   => ['boolean'],
        ]);

        $video->update($data);

        return back();
    }

    public function destroy(Video $video): RedirectResponse
    {
        $video->update(['is_active' => false]);

        return back();
    }
}
