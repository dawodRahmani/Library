<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Book;
use App\Models\Article;
use App\Models\Category;
use App\Models\SiteSetting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    private function getSiteSettings(): array
    {
        try {
            return SiteSetting::allKeyed();
        } catch (\Throwable) {
            return [];
        }
    }

    private function getNavCategories(): array
    {
        $locale = app()->getLocale();

        $map = fn ($cats) => $cats->map(fn ($c) => [
            'slug' => $c->slug,
            'name' => $c->name[$locale] ?? $c->name['da'] ?? collect($c->name)->first() ?? '',
        ])->values()->all();

        return [
            'books'  => $map(Category::where('type', 'book')->orderBy('sort_order')->get()),
            'videos' => $map(Category::where('type', 'video')->orderBy('sort_order')->get()),
            'audios' => $map(Category::where('type', 'audio')->orderBy('sort_order')->get()),
            'fatwas' => $map(Category::where('type', 'fatwa')->orderBy('sort_order')->get()),
        ];
    }

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $logoPath = public_path('images/logo.png');
        $logoUrl  = file_exists($logoPath)
            ? asset('images/logo.png') . '?v=' . filemtime($logoPath)
            : null;

        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'locale' => fn () => app()->getLocale(),
            'locales' => ['da', 'en', 'ar', 'tg'],
            'auth' => [
                'user' => $user,
                'roles' => $user ? $user->getRoleNames()->toArray() : [],
                'permissions' => $user ? $user->getAllPermissions()->pluck('name')->toArray() : [],
            ],
            'sidebarOpen'    => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'logoUrl'        => $logoUrl,
            'navCategories'  => fn () => $this->getNavCategories(),
            'siteSettings'   => fn () => $this->getSiteSettings(),
        ];
    }
}
