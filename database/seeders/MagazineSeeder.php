<?php

namespace Database\Seeders;

use App\Models\Magazine;
use Illuminate\Database\Seeder;

class MagazineSeeder extends Seeder
{
    public function run(): void
    {
        $magazines = [
            [
                'number' => 1,
                'title' => [
                    'da' => 'شماره اول — فصلنامه پژوهش‌های اسلامی',
                    'en' => 'Issue 1 — Islamic Research Quarterly',
                    'ar' => 'العدد الأول — مجلة البحوث الإسلامية الفصلية',
                ],
                'theme' => 'توحید و عقیده',
                'year' => '2023',
                'article_count' => 8,
                'description' => [
                    'da' => 'اولین شماره فصلنامه با محوریت موضوع توحید و عقیده اسلامی',
                    'en' => 'First issue of the quarterly focusing on Islamic monotheism and creed',
                    'ar' => 'العدد الأول من الفصلية بمحور التوحيد والعقيدة الإسلامية',
                ],
                'featured' => true,
                'articles' => ['مقاله اول', 'مقاله دوم', 'مقاله سوم'],
                'cover_image' => null,
                'is_active' => true,
            ],
            [
                'number' => 2,
                'title' => [
                    'da' => 'شماره دوم — جهاد و مقاومت',
                    'en' => 'Issue 2 — Jihad and Resistance',
                    'ar' => 'العدد الثاني — الجهاد والمقاومة',
                ],
                'theme' => 'جهاد',
                'year' => '2023',
                'article_count' => 6,
                'description' => [
                    'da' => 'شماره ویژه درباره جهاد و مقاومت در اسلام',
                    'en' => 'Special issue about jihad and resistance in Islam',
                    'ar' => 'عدد خاص حول الجهاد والمقاومة في الإسلام',
                ],
                'featured' => false,
                'articles' => ['مقاله جهادی اول', 'مقاله جهادی دوم'],
                'cover_image' => null,
                'is_active' => true,
            ],
            [
                'number' => 3,
                'title' => [
                    'da' => 'شماره سوم — فقه معاصر',
                    'en' => 'Issue 3 — Contemporary Fiqh',
                    'ar' => 'العدد الثالث — الفقه المعاصر',
                ],
                'theme' => 'فقه',
                'year' => '2024',
                'article_count' => 7,
                'description' => [
                    'da' => 'شماره سوم با تمرکز بر مسائل فقهی معاصر',
                    'en' => 'Third issue focusing on contemporary jurisprudential issues',
                    'ar' => 'العدد الثالث بتركيز على المسائل الفقهية المعاصرة',
                ],
                'featured' => false,
                'articles' => ['مقاله فقهی اول', 'مقاله فقهی دوم', 'مقاله فقهی سوم'],
                'cover_image' => null,
                'is_active' => true,
            ],
        ];

        foreach ($magazines as $magazine) {
            Magazine::firstOrCreate(
                ['number' => $magazine['number']],
                $magazine
            );
        }
    }
}
