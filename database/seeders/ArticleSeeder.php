<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('type', 'article')->first();
        if (!$category) {
            return;
        }

        $articles = [
            [
                'title' => [
                    'da' => 'تفسیر سوره بقره — بخش اول',
                    'en' => 'Tafseer of Surah Al-Baqarah — Part 1',
                    'ar' => 'تفسير سورة البقرة — الجزء الأول',
                ],
                'excerpt' => [
                    'da' => 'شرح آیات ابتدایی سوره بقره با تمرکز بر مفاهیم توحیدی',
                    'en' => 'Explanation of the initial verses of Surah Al-Baqarah focusing on monotheistic concepts',
                    'ar' => 'شرح الآيات الأولى من سورة البقرة مع التركيز على مفاهيم التوحيد',
                ],
                'content' => [
                    'da' => 'محتوا مقاله...',
                    'en' => 'Article content...',
                    'ar' => 'محتوى المقالة...',
                ],
                'author' => 'دکتر رحیمی',
                'category_id' => $category->id,
                'read_time' => '15 دقیقه',
                'is_active' => true,
            ],
            [
                'title' => [
                    'da' => 'فقه الحنفی — کتاب الصلاة',
                    'en' => 'Hanafi Fiqh — Book of Prayer',
                    'ar' => 'الفقه الحنفي — كتاب الصلاة',
                ],
                'excerpt' => [
                    'da' => 'بررسی احکام نماز از دیدگاه فقه حنفی',
                    'en' => 'Examination of prayer rulings from the Hanafi jurisprudence perspective',
                    'ar' => 'دراسة أحكام الصلاة من منظور الفقه الحنفي',
                ],
                'content' => [
                    'da' => 'محتوا مقاله...',
                    'en' => 'Article content...',
                    'ar' => 'محتوى المقالة...',
                ],
                'author' => 'شیخ محمد',
                'category_id' => $category->id,
                'read_time' => '20 دقیقه',
                'is_active' => true,
            ],
            [
                'title' => [
                    'da' => 'تاریخ اسلام در ماوراءالنهر',
                    'en' => 'History of Islam in Transoxiana',
                    'ar' => 'تاريخ الإسلام في ما وراء النهر',
                ],
                'excerpt' => [
                    'da' => 'بررسی گسترش اسلام در مناطق آسیای مرکزی',
                    'en' => 'Examination of the spread of Islam in Central Asian regions',
                    'ar' => 'دراسة انتشار الإسلام في مناطق آسيا الوسطى',
                ],
                'content' => [
                    'da' => 'محتوا مقاله...',
                    'en' => 'Article content...',
                    'ar' => 'محتوى المقالة...',
                ],
                'author' => 'پروفسور کریمی',
                'category_id' => $category->id,
                'read_time' => '25 دقیقه',
                'is_active' => true,
            ],
        ];

        foreach ($articles as $article) {
            $slug = Str::slug($article['title']['da'] ?? $article['title']['en'] ?? '');
            Article::firstOrCreate(
                ['slug' => $slug],
                array_merge($article, ['slug' => $slug])
            );
        }
    }
}
