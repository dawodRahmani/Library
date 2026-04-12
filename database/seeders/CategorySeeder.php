<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Books
            ['name' => ['da' => 'عقیده و منهج',      'en' => 'Aqeedah & Methodology', 'ar' => 'العقيدة والمنهج',       'tg' => 'Ақида ва Манҳаҷ'],         'slug' => 'aqeedah',    'type' => 'book',    'sort_order' => 1],
            ['name' => ['da' => 'جهاد و استشهاد',     'en' => 'Jihad & Martyrdom',     'ar' => 'الجهاد والاستشهاد',     'tg' => 'Ҷиҳод ва Шаҳодат'],        'slug' => 'jihad',      'type' => 'book',    'sort_order' => 2],
            ['name' => ['da' => 'مقاله‌ها',           'en' => 'Articles',              'ar' => 'المقالات',               'tg' => 'Мақолаҳо'],                 'slug' => 'articles',   'type' => 'book',    'sort_order' => 3],
            ['name' => ['da' => 'سیاست',              'en' => 'Politics',              'ar' => 'السياسة',                'tg' => 'Сиёсат'],                   'slug' => 'politics',   'type' => 'book',    'sort_order' => 4],
            ['name' => ['da' => 'تاریخ',              'en' => 'History',               'ar' => 'التاريخ',                'tg' => 'Таърих'],                   'slug' => 'history',    'type' => 'book',    'sort_order' => 5],
            ['name' => ['da' => 'کتاب‌های گوناگون',   'en' => 'Various Books',         'ar' => 'كتب متنوعة',             'tg' => 'Китобҳои гуногун'],          'slug' => 'various',    'type' => 'book',    'sort_order' => 6],

            // Videos
            ['name' => ['da' => 'عقیده و منهج',      'en' => 'Aqeedah & Methodology', 'ar' => 'العقيدة والمنهج',       'tg' => 'Ақида ва Манҳаҷ'],         'slug' => 'aqeedah',    'type' => 'video',   'sort_order' => 1],
            ['name' => ['da' => 'پند و موعظه',       'en' => 'Advice & Preaching',    'ar' => 'النصح والوعظ',           'tg' => 'Панд ва Мавъиза'],          'slug' => 'advice',     'type' => 'video',   'sort_order' => 2],
            ['name' => ['da' => 'جهاد و استشهاد',     'en' => 'Jihad & Martyrdom',     'ar' => 'الجهاد والاستشهاد',     'tg' => 'Ҷиҳод ва Шаҳодат'],        'slug' => 'jihad',      'type' => 'video',   'sort_order' => 3],
            ['name' => ['da' => 'سیاست',              'en' => 'Politics',              'ar' => 'السياسة',                'tg' => 'Сиёсат'],                   'slug' => 'politics',   'type' => 'video',   'sort_order' => 4],
            ['name' => ['da' => 'تحلیل و سخن روز',   'en' => 'Analysis & Daily Talk', 'ar' => 'التحليل وحديث اليوم',   'tg' => 'Таҳлил ва Суҳбати Рӯз'],   'slug' => 'analysis',   'type' => 'video',   'sort_order' => 5],
            ['name' => ['da' => 'تاریخ',              'en' => 'History',               'ar' => 'التاريخ',                'tg' => 'Таърих'],                   'slug' => 'history',    'type' => 'video',   'sort_order' => 6],

            // Audio
            ['name' => ['da' => 'عقیده و منهج',      'en' => 'Aqeedah & Methodology', 'ar' => 'العقيدة والمنهج',       'tg' => 'Ақида ва Манҳаҷ'],         'slug' => 'aqeedah',    'type' => 'audio',   'sort_order' => 1],
            ['name' => ['da' => 'پند و موعظه',       'en' => 'Advice & Preaching',    'ar' => 'النصح والوعظ',           'tg' => 'Панд ва Мавъиза'],          'slug' => 'advice',     'type' => 'audio',   'sort_order' => 2],
            ['name' => ['da' => 'جهاد و استشهاد',     'en' => 'Jihad & Martyrdom',     'ar' => 'الجهاد والاستشهاد',     'tg' => 'Ҷиҳод ва Шаҳодат'],        'slug' => 'jihad',      'type' => 'audio',   'sort_order' => 3],
            ['name' => ['da' => 'سیاست',              'en' => 'Politics',              'ar' => 'السياسة',                'tg' => 'Сиёсат'],                   'slug' => 'politics',   'type' => 'audio',   'sort_order' => 4],
            ['name' => ['da' => 'تحلیل و سخن روز',   'en' => 'Analysis & Daily Talk', 'ar' => 'التحليل وحديث اليوم',   'tg' => 'Таҳлил ва Суҳбати Рӯз'],   'slug' => 'analysis',   'type' => 'audio',   'sort_order' => 5],
            ['name' => ['da' => 'تاریخ',              'en' => 'History',               'ar' => 'التاريخ',                'tg' => 'Таърих'],                   'slug' => 'history',    'type' => 'audio',   'sort_order' => 6],
            ['name' => ['da' => 'نشید و ترانه',      'en' => 'Nasheed & Songs',       'ar' => 'الأناشيد والأغاني',      'tg' => 'Нашид ва Суруд'],           'slug' => 'nasheed',    'type' => 'audio',   'sort_order' => 7],

            // Fatwas (Dar-ul-Ifta)
            ['name' => ['da' => 'توحید و عقیده',     'en' => 'Tawheed & Aqeedah',     'ar' => 'التوحيد والعقيدة',      'tg' => 'Тавҳид ва Ақида'],          'slug' => 'tawheed',    'type' => 'fatwa',   'sort_order' => 1],
            ['name' => ['da' => 'جهاد و استشهاد',     'en' => 'Jihad & Martyrdom',     'ar' => 'الجهاد والاستشهاد',     'tg' => 'Ҷиҳод ва Шаҳодат'],        'slug' => 'jihad',      'type' => 'fatwa',   'sort_order' => 2],
            ['name' => ['da' => 'قضایای سیاسی',      'en' => 'Political Issues',      'ar' => 'القضايا السياسية',       'tg' => 'Масоили Сиёсӣ'],            'slug' => 'political',  'type' => 'fatwa',   'sort_order' => 3],
            ['name' => ['da' => 'احکام شرعی عام',    'en' => 'General Rulings',       'ar' => 'الأحكام الشرعية العامة', 'tg' => 'Аҳкоми Шаръии Умумӣ'],    'slug' => 'rulings',    'type' => 'fatwa',   'sort_order' => 4],
            ['name' => ['da' => 'بیانیه‌ها',          'en' => 'Statements',            'ar' => 'البيانات',               'tg' => 'Баёнияҳо'],                 'slug' => 'statements', 'type' => 'fatwa',   'sort_order' => 5],

            // Articles
            ['name' => ['da' => 'تفسیر',   'en' => 'Tafseer',   'ar' => 'التفسير',  'tg' => 'Тафсир'],    'slug' => 'tafseer',   'type' => 'article', 'sort_order' => 1],
            ['name' => ['da' => 'تاریخ',   'en' => 'History',   'ar' => 'التاريخ',  'tg' => 'Таърих'],    'slug' => 'history',   'type' => 'article', 'sort_order' => 2],
            ['name' => ['da' => 'فقه',     'en' => 'Fiqh',      'ar' => 'الفقه',    'tg' => 'Фиқҳ'],      'slug' => 'fiqh',      'type' => 'article', 'sort_order' => 3],
            ['name' => ['da' => 'عقیده',   'en' => 'Aqeedah',   'ar' => 'العقيدة',  'tg' => 'Ақида'],     'slug' => 'aqeedah',   'type' => 'article', 'sort_order' => 4],
            ['name' => ['da' => 'تحلیل',   'en' => 'Analysis',  'ar' => 'التحليل',  'tg' => 'Таҳлил'],    'slug' => 'analysis',  'type' => 'article', 'sort_order' => 5],
            ['name' => ['da' => 'قرآن',    'en' => 'Quran',     'ar' => 'القرآن',   'tg' => 'Қуръон'],    'slug' => 'quran',     'type' => 'article', 'sort_order' => 6],

            // Magazine
            ['name' => ['da' => 'مجله',    'en' => 'Magazine',  'ar' => 'المجلة',   'tg' => 'Маҷалла'],   'slug' => 'magazine',  'type' => 'magazine', 'sort_order' => 1],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug'], 'type' => $category['type']],
                $category,
            );
        }
    }
}
