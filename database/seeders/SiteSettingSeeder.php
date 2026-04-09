<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            // ── General ─────────────────────────────────────────────
            ['key' => 'site_name',    'group' => 'general', 'value' => ['da' => 'کتابخانه رسالت',   'en' => 'Resalat Library']],
            ['key' => 'site_tagline', 'group' => 'general', 'value' => ['da' => 'بزرگترین کتابخانه دیجیتال اسلامی به زبان دری', 'en' => 'The largest Islamic digital library in Dari']],
            ['key' => 'contact_email',   'group' => 'general', 'value' => 'info@resalatlib.af'],
            ['key' => 'contact_phone',   'group' => 'general', 'value' => '+93 700 000 000'],
            ['key' => 'contact_address', 'group' => 'general', 'value' => ['da' => 'کابل، افغانستان', 'en' => 'Kabul, Afghanistan']],

            // ── Social links ─────────────────────────────────────────
            ['key' => 'social_links', 'group' => 'social', 'value' => [
                ['platform' => 'facebook', 'url' => '#', 'count' => '521'],
                ['platform' => 'twitter',  'url' => '#', 'count' => '3,297'],
                ['platform' => 'youtube',  'url' => '#', 'count' => '596K'],
                ['platform' => 'linkedin', 'url' => '#', 'count' => '1,240'],
                ['platform' => 'rss',      'url' => '#', 'count' => ''],
            ]],

            // ── News ticker ──────────────────────────────────────────
            ['key' => 'ticker_items', 'group' => 'ticker', 'value' => [
                ['da' => 'آخرین کتاب‌های اضافه شده به کتابخانه',       'en' => 'Latest books added to the library'],
                ['da' => 'مقاله جدید: تاریخچه خط و کتابت در افغانستان', 'en' => 'New article: History of writing in Afghanistan'],
                ['da' => 'سخنرانی ویدیویی جدید بارگذاری شد',           'en' => 'New video lecture uploaded'],
                ['da' => 'کتاب‌های دیجیتال جدید در دسته‌بندی فقه',      'en' => 'New digital books in the Fiqh category'],
                ['da' => 'صوت‌های تازه در بخش شرح حدیث',              'en' => 'New audio in the Hadith commentary section'],
            ]],

            // ── Footer ───────────────────────────────────────────────
            ['key' => 'footer_about', 'group' => 'footer', 'value' => [
                'da' => 'کتابخانه رسالت یک پروژه فرهنگی و دینی است که هدف آن گردآوری و دیجیتالی‌سازی منابع علمی اسلامی به زبان دری می‌باشد. ما تلاش می‌کنیم تا بهترین محتوای علمی را در دسترس همگان قرار دهیم.',
                'en' => 'Resalat Library is a cultural and religious project aimed at collecting and digitizing Islamic scholarly resources in Dari. We strive to make the best scholarly content accessible to everyone.',
            ]],
        ];

        foreach ($defaults as $row) {
            SiteSetting::updateOrCreate(['key' => $row['key']], $row);
        }
    }
}
