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
            ['name' => ['da' => 'عقیده و منهج',      'en' => 'Aqeedah & Methodology'], 'slug' => 'aqeedah',    'type' => 'book',    'sort_order' => 1],
            ['name' => ['da' => 'جهاد و استشهاد',     'en' => 'Jihad & Martyrdom'],      'slug' => 'jihad',      'type' => 'book',    'sort_order' => 2],
            ['name' => ['da' => 'مقاله‌ها',           'en' => 'Articles'],               'slug' => 'articles',   'type' => 'book',    'sort_order' => 3],
            ['name' => ['da' => 'سیاست',              'en' => 'Politics'],               'slug' => 'politics',   'type' => 'book',    'sort_order' => 4],
            ['name' => ['da' => 'تاریخ',              'en' => 'History'],                'slug' => 'history',    'type' => 'book',    'sort_order' => 5],
            ['name' => ['da' => 'کتاب‌های گوناگون',   'en' => 'Various Books'],          'slug' => 'various',    'type' => 'book',    'sort_order' => 6],

            // Videos
            ['name' => ['da' => 'عقیده و منهج',      'en' => 'Aqeedah & Methodology'], 'slug' => 'aqeedah',    'type' => 'video',   'sort_order' => 1],
            ['name' => ['da' => 'پند و موعظه',       'en' => 'Advice & Preaching'],     'slug' => 'advice',     'type' => 'video',   'sort_order' => 2],
            ['name' => ['da' => 'جهاد و استشهاد',     'en' => 'Jihad & Martyrdom'],      'slug' => 'jihad',      'type' => 'video',   'sort_order' => 3],
            ['name' => ['da' => 'سیاست',              'en' => 'Politics'],               'slug' => 'politics',   'type' => 'video',   'sort_order' => 4],
            ['name' => ['da' => 'تحلیل و سخن روز',   'en' => 'Analysis & Daily Talk'],   'slug' => 'analysis',   'type' => 'video',   'sort_order' => 5],
            ['name' => ['da' => 'تاریخ',              'en' => 'History'],                'slug' => 'history',    'type' => 'video',   'sort_order' => 6],

            // Audio
            ['name' => ['da' => 'عقیده و منهج',      'en' => 'Aqeedah & Methodology'], 'slug' => 'aqeedah',    'type' => 'audio',   'sort_order' => 1],
            ['name' => ['da' => 'پند و موعظه',       'en' => 'Advice & Preaching'],     'slug' => 'advice',     'type' => 'audio',   'sort_order' => 2],
            ['name' => ['da' => 'جهاد و استشهاد',     'en' => 'Jihad & Martyrdom'],      'slug' => 'jihad',      'type' => 'audio',   'sort_order' => 3],
            ['name' => ['da' => 'سیاست',              'en' => 'Politics'],               'slug' => 'politics',   'type' => 'audio',   'sort_order' => 4],
            ['name' => ['da' => 'تحلیل و سخن روز',   'en' => 'Analysis & Daily Talk'],   'slug' => 'analysis',   'type' => 'audio',   'sort_order' => 5],
            ['name' => ['da' => 'تاریخ',              'en' => 'History'],                'slug' => 'history',    'type' => 'audio',   'sort_order' => 6],
            ['name' => ['da' => 'نشید و ترانه',      'en' => 'Nasheed & Songs'],        'slug' => 'nasheed',    'type' => 'audio',   'sort_order' => 7],

            // Fatwas (Dar-ul-Ifta)
            ['name' => ['da' => 'توحید و عقیده',     'en' => 'Tawheed & Aqeedah'],      'slug' => 'tawheed',    'type' => 'fatwa',   'sort_order' => 1],
            ['name' => ['da' => 'جهاد و استشهاد',     'en' => 'Jihad & Martyrdom'],      'slug' => 'jihad',      'type' => 'fatwa',   'sort_order' => 2],
            ['name' => ['da' => 'قضایای سیاسی',      'en' => 'Political Issues'],        'slug' => 'political',  'type' => 'fatwa',   'sort_order' => 3],
            ['name' => ['da' => 'احکام شرعی عام',    'en' => 'General Rulings'],         'slug' => 'rulings',    'type' => 'fatwa',   'sort_order' => 4],
            ['name' => ['da' => 'بیانیه‌ها',          'en' => 'Statements'],              'slug' => 'statements', 'type' => 'fatwa',   'sort_order' => 5],

            // Articles
            ['name' => ['da' => 'تفسیر',   'en' => 'Tafseer'],   'slug' => 'tafseer',   'type' => 'article', 'sort_order' => 1],
            ['name' => ['da' => 'تاریخ',   'en' => 'History'],   'slug' => 'history',   'type' => 'article', 'sort_order' => 2],
            ['name' => ['da' => 'فقه',     'en' => 'Fiqh'],      'slug' => 'fiqh',      'type' => 'article', 'sort_order' => 3],
            ['name' => ['da' => 'عقیده',   'en' => 'Aqeedah'],   'slug' => 'aqeedah',   'type' => 'article', 'sort_order' => 4],
            ['name' => ['da' => 'تحلیل',   'en' => 'Analysis'],  'slug' => 'analysis',  'type' => 'article', 'sort_order' => 5],
            ['name' => ['da' => 'قرآن',    'en' => 'Quran'],     'slug' => 'quran',     'type' => 'article', 'sort_order' => 6],

            // Magazine
            ['name' => ['da' => 'مجله',    'en' => 'Magazine'],  'slug' => 'magazine',  'type' => 'magazine', 'sort_order' => 1],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug'], 'type' => $category['type']],
                $category,
            );
        }
    }
}
