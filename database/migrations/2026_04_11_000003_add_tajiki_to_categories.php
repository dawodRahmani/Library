<?php

use App\Models\Category;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $translations = [
            ['slug' => 'aqeedah',    'type' => 'book',     'tg' => 'Ақида ва Манҳаҷ'],
            ['slug' => 'jihad',      'type' => 'book',     'tg' => 'Ҷиҳод ва Шаҳодат'],
            ['slug' => 'articles',   'type' => 'book',     'tg' => 'Мақолаҳо'],
            ['slug' => 'politics',   'type' => 'book',     'tg' => 'Сиёсат'],
            ['slug' => 'history',    'type' => 'book',     'tg' => 'Таърих'],
            ['slug' => 'various',    'type' => 'book',     'tg' => 'Китобҳои гуногун'],

            ['slug' => 'aqeedah',    'type' => 'video',    'tg' => 'Ақида ва Манҳаҷ'],
            ['slug' => 'advice',     'type' => 'video',    'tg' => 'Панд ва Мавъиза'],
            ['slug' => 'jihad',      'type' => 'video',    'tg' => 'Ҷиҳод ва Шаҳодат'],
            ['slug' => 'politics',   'type' => 'video',    'tg' => 'Сиёсат'],
            ['slug' => 'analysis',   'type' => 'video',    'tg' => 'Таҳлил ва Суҳбати Рӯз'],
            ['slug' => 'history',    'type' => 'video',    'tg' => 'Таърих'],

            ['slug' => 'aqeedah',    'type' => 'audio',    'tg' => 'Ақида ва Манҳаҷ'],
            ['slug' => 'advice',     'type' => 'audio',    'tg' => 'Панд ва Мавъиза'],
            ['slug' => 'jihad',      'type' => 'audio',    'tg' => 'Ҷиҳод ва Шаҳодат'],
            ['slug' => 'politics',   'type' => 'audio',    'tg' => 'Сиёсат'],
            ['slug' => 'analysis',   'type' => 'audio',    'tg' => 'Таҳлил ва Суҳбати Рӯз'],
            ['slug' => 'history',    'type' => 'audio',    'tg' => 'Таърих'],
            ['slug' => 'nasheed',    'type' => 'audio',    'tg' => 'Нашид ва Суруд'],

            ['slug' => 'tawheed',    'type' => 'fatwa',    'tg' => 'Тавҳид ва Ақида'],
            ['slug' => 'jihad',      'type' => 'fatwa',    'tg' => 'Ҷиҳод ва Шаҳодат'],
            ['slug' => 'political',  'type' => 'fatwa',    'tg' => 'Масоили Сиёсӣ'],
            ['slug' => 'rulings',    'type' => 'fatwa',    'tg' => 'Аҳкоми Шаръии Умумӣ'],
            ['slug' => 'statements', 'type' => 'fatwa',    'tg' => 'Баёнияҳо'],

            ['slug' => 'tafseer',    'type' => 'article',  'tg' => 'Тафсир'],
            ['slug' => 'history',    'type' => 'article',  'tg' => 'Таърих'],
            ['slug' => 'fiqh',       'type' => 'article',  'tg' => 'Фиқҳ'],
            ['slug' => 'aqeedah',    'type' => 'article',  'tg' => 'Ақида'],
            ['slug' => 'analysis',   'type' => 'article',  'tg' => 'Таҳлил'],
            ['slug' => 'quran',      'type' => 'article',  'tg' => 'Қуръон'],

            ['slug' => 'magazine',   'type' => 'magazine', 'tg' => 'Маҷалла'],
        ];

        foreach ($translations as $row) {
            $category = Category::where('slug', $row['slug'])
                ->where('type', $row['type'])
                ->first();

            if (! $category) {
                continue;
            }

            $name = $category->name;
            if (empty($name['tg'])) {
                $name['tg'] = $row['tg'];
                $category->name = $name;
                $category->save();
            }
        }
    }

    public function down(): void
    {
        Category::all()->each(function ($category) {
            $name = $category->name;
            unset($name['tg']);
            $category->name = $name;
            $category->save();
        });
    }
};
