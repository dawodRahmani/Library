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

        // Pull the 5 most recent content items for the hero section
        $heroItems = collect()
            ->merge(
                Book::where('is_active', true)->latest()->limit(2)->get()->map(fn ($b) => [
                    'type'     => 'book',
                    'title'    => $b->title[$locale]  ?? $b->title['da']  ?? '',
                    'category' => ['da' => 'کتاب', 'en' => 'Book'],
                    'link'     => '/library',
                    'gradient' => 'from-emerald-950 to-teal-900',
                    'created_at' => $b->created_at,
                ])
            )
            ->merge(
                Article::where('is_active', true)->latest()->limit(2)->get()->map(fn ($a) => [
                    'type'     => 'article',
                    'title'    => $a->title[$locale]  ?? $a->title['da']  ?? '',
                    'category' => ['da' => 'مقاله', 'en' => 'Article'],
                    'link'     => '/articles',
                    'gradient' => 'from-blue-950 to-indigo-900',
                    'cover_image' => $a->cover_image,
                    'created_at' => $a->created_at,
                ])
            )
            ->merge(
                Video::where('is_active', true)->latest()->limit(1)->get()->map(fn ($v) => [
                    'type'     => 'video',
                    'title'    => $v->title[$locale]  ?? $v->title['da']  ?? '',
                    'category' => ['da' => 'ویدیو', 'en' => 'Video'],
                    'link'     => '/library/videos',
                    'gradient' => 'from-violet-950 to-purple-900',
                    'created_at' => $v->created_at,
                ])
            )
            ->merge(
                Audio::where('is_active', true)->latest()->limit(1)->get()->map(fn ($a) => [
                    'type'     => 'audio',
                    'title'    => $a->title[$locale]  ?? $a->title['da']  ?? '',
                    'category' => ['da' => 'صوت', 'en' => 'Audio'],
                    'link'     => '/audio',
                    'gradient' => 'from-rose-950 to-red-900',
                    'created_at' => $a->created_at,
                ])
            )
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->map(fn ($item) => collect($item)->except('created_at')->toArray())
            ->toArray();

        // Pad to 5 items if DB is empty with fallback placeholders
        $gradients = [
            'from-emerald-950 to-teal-900',
            'from-blue-950 to-indigo-900',
            'from-violet-950 to-purple-900',
            'from-rose-950 to-red-900',
            'from-amber-950 to-yellow-900',
        ];
        while (count($heroItems) < 5) {
            $i = count($heroItems);
            $heroItems[] = [
                'type'     => 'placeholder',
                'title'    => $locale === 'en' ? 'Content coming soon' : 'محتوا به زودی اضافه می‌شود',
                'category' => ['da' => 'کتابخانه', 'en' => 'Library'],
                'link'     => '/',
                'gradient' => $gradients[$i % count($gradients)],
            ];
        }

        return Inertia::render('welcome', [
            'heroItems' => $heroItems,
        ]);
    }
}
