<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Audio;
use App\Models\Book;
use App\Models\Category;
use App\Models\Fatwa;
use App\Models\Magazine;
use App\Models\User;
use App\Models\Video;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $locale = app()->getLocale();

        // Real stats from DB
        $stats = [
            'books'      => Book::where('is_active', true)->count(),
            'articles'   => Article::where('is_active', true)->count(),
            'audios'     => Audio::where('is_active', true)->count(),
            'videos'     => Video::where('is_active', true)->count(),
            'fatwas'     => Fatwa::where('is_active', true)->count(),
            'magazines'  => Magazine::where('is_active', true)->count(),
            'users'      => User::where('is_active', true)->count(),
            'categories' => Category::count(),
        ];

        // 8 most recent items across all content types
        $recent = collect();

        $recent = $recent->merge(
            Book::where('is_active', true)->latest()->limit(3)->get()->map(fn ($b) => [
                'type'  => 'book',
                'title' => $b->title[$locale] ?? $b->title['da'] ?? '',
                'date'  => $b->created_at->diffForHumans(),
                'href'  => '/admin/books',
            ])
        );

        $recent = $recent->merge(
            Article::where('is_active', true)->latest()->limit(3)->get()->map(fn ($a) => [
                'type'  => 'article',
                'title' => $a->title[$locale] ?? $a->title['da'] ?? '',
                'date'  => $a->created_at->diffForHumans(),
                'href'  => '/admin/articles',
            ])
        );

        $recent = $recent->merge(
            Video::where('is_active', true)->latest()->limit(2)->get()->map(fn ($v) => [
                'type'  => 'video',
                'title' => $v->title[$locale] ?? $v->title['da'] ?? '',
                'date'  => $v->created_at->diffForHumans(),
                'href'  => '/admin/videos',
            ])
        );

        $recent = $recent->merge(
            Audio::where('is_active', true)->latest()->limit(2)->get()->map(fn ($a) => [
                'type'  => 'audio',
                'title' => $a->title[$locale] ?? $a->title['da'] ?? '',
                'date'  => $a->created_at->diffForHumans(),
                'href'  => '/admin/audios',
            ])
        );

        // Sort by most recently added (diffForHumans loses sort info, so we sort before mapping)
        $recentActivity = collect()
            ->merge(Book::where('is_active', true)->latest()->limit(3)->get()->map(fn ($b) => ['type' => 'book',    'title' => $b->title[$locale] ?? $b->title['da'] ?? '', 'created_at' => $b->created_at, 'href' => '/admin/books']))
            ->merge(Article::where('is_active', true)->latest()->limit(3)->get()->map(fn ($a) => ['type' => 'article', 'title' => $a->title[$locale] ?? $a->title['da'] ?? '', 'created_at' => $a->created_at, 'href' => '/admin/articles']))
            ->merge(Video::where('is_active', true)->latest()->limit(3)->get()->map(fn ($v) => ['type' => 'video',   'title' => $v->title[$locale] ?? $v->title['da'] ?? '', 'created_at' => $v->created_at, 'href' => '/admin/videos']))
            ->merge(Audio::where('is_active', true)->latest()->limit(3)->get()->map(fn ($a) => ['type' => 'audio',   'title' => $a->title[$locale] ?? $a->title['da'] ?? '', 'created_at' => $a->created_at, 'href' => '/admin/audios']))
            ->merge(Fatwa::where('is_active', true)->latest()->limit(2)->get()->map(fn ($f) => ['type' => 'fatwa',   'title' => $f->title[$locale] ?? $f->title['da'] ?? '', 'created_at' => $f->created_at, 'href' => '/admin/fatwas']))
            ->sortByDesc('created_at')
            ->take(8)
            ->values()
            ->map(fn ($item) => [
                'type'  => $item['type'],
                'title' => $item['title'],
                'date'  => $item['created_at']->diffForHumans(),
                'href'  => $item['href'],
            ]);

        return Inertia::render('dashboard', [
            'stats'          => $stats,
            'recentActivity' => $recentActivity,
        ]);
    }
}
