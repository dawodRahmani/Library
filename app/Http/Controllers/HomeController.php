<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Audio;
use App\Models\Book;
use App\Models\Video;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $locale = app()->getLocale();

        // Hero: only items that have a real image
        $heroItems = collect()
            ->merge(
                Article::where('is_active', true)->whereNotNull('cover_image')->latest()->limit(3)->get()
                    ->map(fn ($a) => [
                        'type'       => 'article',
                        'title'      => $a->title[$locale] ?? $a->title['da'] ?? '',
                        'category'   => ['da' => 'مقاله', 'en' => 'Article'],
                        'link'       => '/articles',
                        'image'      => '/storage/' . $a->cover_image,
                        'created_at' => $a->created_at,
                    ])
            )
            ->merge(
                Book::where('is_active', true)->whereNotNull('cover_image')->latest()->limit(2)->get()
                    ->map(fn ($b) => [
                        'type'       => 'book',
                        'title'      => $b->title[$locale] ?? $b->title['da'] ?? '',
                        'category'   => ['da' => 'کتاب', 'en' => 'Book'],
                        'link'       => '/library',
                        'image'      => '/storage/' . $b->cover_image,
                        'created_at' => $b->created_at,
                    ])
            )
            ->merge(
                Video::where('is_active', true)->latest()->limit(5)->get()
                    ->map(function ($v) use ($locale) {
                        $youtubeId = VideoController::extractYoutubeId($v->video_url);
                        $image = null;
                        if ($v->thumbnail) {
                            $image = '/storage/' . $v->thumbnail;
                        } elseif ($youtubeId) {
                            $image = 'https://img.youtube.com/vi/' . $youtubeId . '/maxresdefault.jpg';
                        }
                        if (!$image) return null;
                        return [
                            'type'       => 'video',
                            'title'      => $v->title[$locale] ?? $v->title['da'] ?? '',
                            'category'   => ['da' => 'ویدیو', 'en' => 'Video'],
                            'link'       => '/library/videos',
                            'image'      => $image,
                            'created_at' => $v->created_at,
                        ];
                    })
                    ->filter()
                    ->take(2)
            )
            ->merge(
                Audio::where('is_active', true)->whereNotNull('thumbnail')->latest()->limit(2)->get()
                    ->map(fn ($a) => [
                        'type'       => 'audio',
                        'title'      => $a->title[$locale] ?? $a->title['da'] ?? '',
                        'category'   => ['da' => 'صوت', 'en' => 'Audio'],
                        'link'       => '/audio',
                        'image'      => '/storage/' . $a->thumbnail,
                        'created_at' => $a->created_at,
                    ])
            )
            ->filter()
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->map(fn ($item) => collect($item)->except('created_at')->toArray())
            ->toArray();

        $recentVideos = Video::where('is_active', true)
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn ($v) => [
                'id'           => $v->id,
                'title'        => $v->title[$locale] ?? $v->title['da'] ?? '',
                'instructor'   => $v->instructor,
                'thumbnail'    => $v->thumbnail,
                'video_url'    => $v->video_url,
                'video_source' => $v->video_source ?? 'link',
                'youtube_id'   => VideoController::extractYoutubeId($v->video_url),
                'duration'     => $v->duration,
            ])
            ->toArray();

        $recentArticles = Article::where('is_active', true)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($a) => [
                'id'          => $a->id,
                'title'       => $a->title[$locale] ?? $a->title['da'] ?? '',
                'author'      => $a->author ?? '',
                'date'        => $a->created_at->format('Y-m-d'),
                'cover_image' => $a->cover_image,
            ])
            ->toArray();

        $recentAudios = Audio::where('is_active', true)
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn ($a) => [
                'id'        => $a->id,
                'title'     => $a->title[$locale] ?? $a->title['da'] ?? '',
                'author'    => $a->instructor ?? '',
                'date'      => $a->created_at->format('Y-m-d'),
                'thumbnail' => $a->thumbnail,
            ])
            ->toArray();

        $recentBooks = Book::where('is_active', true)
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn ($b) => [
                'id'          => $b->id,
                'title'       => $b->title[$locale] ?? $b->title['da'] ?? '',
                'author'      => $b->author ?? '',
                'date'        => $b->created_at->format('Y-m-d'),
                'cover_image' => $b->cover_image,
            ])
            ->toArray();

        return Inertia::render('welcome', [
            'heroItems'      => $heroItems,
            'recentVideos'   => $recentVideos,
            'recentArticles' => $recentArticles,
            'recentAudios'   => $recentAudios,
            'recentBooks'    => $recentBooks,
        ]);
    }
}
