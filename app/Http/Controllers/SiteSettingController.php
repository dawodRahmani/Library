<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function adminIndex(): Response
    {
        return Inertia::render('admin/site-settings/index', [
            'settings' => SiteSetting::allKeyed(),
        ]);
    }

    public function bulkUpdate(Request $request): RedirectResponse
    {
        $data = $request->validate([
            // General
            'site_name'        => ['nullable', 'array'],
            'site_tagline'     => ['nullable', 'array'],
            'contact_email'    => ['nullable', 'string', 'max:255'],
            'contact_phone'    => ['nullable', 'string', 'max:50'],
            'contact_address'  => ['nullable', 'array'],
            'contact_hours'    => ['nullable', 'array'],
            // Social
            'social_links'     => ['nullable', 'array'],
            'social_links.*.platform' => ['required', 'string'],
            'social_links.*.url'      => ['nullable', 'string', 'max:500'],
            'social_links.*.count'    => ['nullable', 'string', 'max:20'],
            // Ticker
            'ticker_items'     => ['nullable', 'array'],
            'ticker_items.*.da' => ['nullable', 'string', 'max:500'],
            'ticker_items.*.en' => ['nullable', 'string', 'max:500'],
            // Footer
            'footer_about'     => ['nullable', 'array'],
            // About page
            'about_hero'       => ['nullable', 'array'],
            'about_stats'      => ['nullable', 'array'],
            'about_values'     => ['nullable', 'array'],
            'about_team'       => ['nullable', 'array'],
        ]);

        $groups = [
            'site_name'       => 'general',
            'site_tagline'    => 'general',
            'contact_email'   => 'general',
            'contact_phone'   => 'general',
            'contact_address' => 'general',
            'contact_hours'   => 'general',
            'social_links'    => 'social',
            'ticker_items'    => 'ticker',
            'footer_about'    => 'footer',
            'about_hero'      => 'about',
            'about_stats'     => 'about',
            'about_values'    => 'about',
            'about_team'      => 'about',
        ];

        foreach ($data as $key => $value) {
            SiteSetting::set($key, $value, $groups[$key] ?? 'general');
        }

        // Clear all setting caches
        foreach (array_keys($groups) as $key) {
            Cache::forget("site_setting:{$key}");
        }

        return back()->with('success', 'تنظیمات با موفقیت ذخیره شد.');
    }

    public function uploadLogo(Request $request): RedirectResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $dir = public_path('images');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $request->file('logo')->move($dir, 'logo.png');

        return back()->with('success', 'لوگو با موفقیت آپلود شد.');
    }

    public function removeLogo(): RedirectResponse
    {
        $logoPath = public_path('images/logo.png');
        if (file_exists($logoPath)) {
            unlink($logoPath);
        }

        return back()->with('success', 'لوگو حذف شد.');
    }
}
