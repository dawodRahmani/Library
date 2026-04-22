<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
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
            'about_stats_hidden' => ['nullable', 'boolean'],
            'about_intro'      => ['nullable', 'array'],
            'about_intro_hidden' => ['nullable', 'boolean'],
            'about_values'     => ['nullable', 'array'],
            'about_values_hidden' => ['nullable', 'boolean'],
            'about_team'       => ['nullable', 'array'],
            // Contact QR
            'contact_qr_link'   => ['nullable', 'string', 'max:1000'],
            'contact_qr_title'  => ['nullable', 'array'],
            'contact_qr_hidden' => ['nullable', 'boolean'],
        ]);

        $data['about_stats_hidden']  = (bool) ($data['about_stats_hidden']  ?? false);
        $data['about_intro_hidden']  = (bool) ($data['about_intro_hidden']  ?? false);
        $data['about_values_hidden'] = (bool) ($data['about_values_hidden'] ?? false);
        $data['contact_qr_hidden']   = (bool) ($data['contact_qr_hidden']   ?? false);

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
            'about_stats_hidden' => 'about',
            'about_intro'     => 'about',
            'about_intro_hidden' => 'about',
            'about_values'    => 'about',
            'about_values_hidden' => 'about',
            'about_team'      => 'about',
            'contact_qr_link'   => 'contact',
            'contact_qr_title'  => 'contact',
            'contact_qr_hidden' => 'contact',
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

    public function uploadContactQr(Request $request): RedirectResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $existing = SiteSetting::get('contact_qr_image');
        if ($existing && Storage::disk('public')->exists($existing)) {
            Storage::disk('public')->delete($existing);
        }

        $path = $request->file('image')->store('contact', 'public');
        SiteSetting::set('contact_qr_image', $path, 'contact');
        Cache::forget('site_setting:contact_qr_image');

        return back()->with('success', 'تصویر QR با موفقیت آپلود شد.');
    }

    public function removeContactQr(): RedirectResponse
    {
        $existing = SiteSetting::get('contact_qr_image');
        if ($existing && Storage::disk('public')->exists($existing)) {
            Storage::disk('public')->delete($existing);
        }

        SiteSetting::set('contact_qr_image', null, 'contact');
        Cache::forget('site_setting:contact_qr_image');

        return back()->with('success', 'تصویر QR حذف شد.');
    }

    public function uploadAboutHero(Request $request): RedirectResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $existing = SiteSetting::get('about_hero_image');
        if ($existing && Storage::disk('public')->exists($existing)) {
            Storage::disk('public')->delete($existing);
        }

        $path = $request->file('image')->store('about', 'public');
        SiteSetting::set('about_hero_image', $path, 'about');
        Cache::forget('site_setting:about_hero_image');

        return back()->with('success', 'تصویر بنر با موفقیت آپلود شد.');
    }

    public function removeAboutHero(): RedirectResponse
    {
        $existing = SiteSetting::get('about_hero_image');
        if ($existing && Storage::disk('public')->exists($existing)) {
            Storage::disk('public')->delete($existing);
        }

        SiteSetting::set('about_hero_image', null, 'about');
        Cache::forget('site_setting:about_hero_image');

        return back()->with('success', 'تصویر بنر حذف شد.');
    }
}
