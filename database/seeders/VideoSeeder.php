<?php

namespace Database\Seeders;

use App\Models\Video;
use App\Models\Category;
use Illuminate\Database\Seeder;

class VideoSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('type', 'video')->first();
        if (!$category) {
            return;
        }

        $videos = [
            [
                'title' => [
                    'da' => 'اصول عقیده اسلامی',
                    'en' => 'Fundamentals of Islamic Aqeedah',
                    'ar' => 'أصول العقيدة الإسلامية',
                ],
                'instructor' => 'شیخ احمد',
                'category_id' => $category->id,
                'duration' => '45:20',
                'views' => 12500,
                'year' => 2023,
                'status' => 'published',
                'description' => [
                    'da' => 'سخنرانی جامع درباره اصول عقیده اسلامی',
                    'en' => 'Comprehensive lecture on the fundamentals of Islamic creed',
                    'ar' => 'محاضرة شاملة حول أصول العقيدة الإسلامية',
                ],
                'thumbnail' => null,
                'video_url' => 'https://example.com/video1',
                'is_active' => true,
            ],
            [
                'title' => [
                    'da' => 'جهاد در راه خدا',
                    'en' => 'Jihad in the Path of Allah',
                    'ar' => 'الجهاد في سبيل الله',
                ],
                'instructor' => 'دکتر عمر',
                'category_id' => $category->id,
                'duration' => '38:15',
                'views' => 9800,
                'year' => 2022,
                'status' => 'published',
                'description' => [
                    'da' => 'تحلیل فقهی و تاریخی درباره مفهوم جهاد',
                    'en' => 'Jurisprudential and historical analysis of the concept of jihad',
                    'ar' => 'تحليل فقهي وتاريخي حول مفهوم الجهاد',
                ],
                'thumbnail' => null,
                'video_url' => 'https://example.com/video2',
                'is_active' => true,
            ],
            [
                'title' => [
                    'da' => 'تاریخ اسلام در خراسان',
                    'en' => 'History of Islam in Khorasan',
                    'ar' => 'تاريخ الإسلام في خراسان',
                ],
                'instructor' => 'پروفسور رحیمی',
                'category_id' => $category->id,
                'duration' => '52:10',
                'views' => 7600,
                'year' => 2021,
                'status' => 'published',
                'description' => [
                    'da' => 'بررسی تاریخ اسلام در منطقه خراسان بزرگ',
                    'en' => 'Examination of Islamic history in Greater Khorasan region',
                    'ar' => 'دراسة تاريخ الإسلام في منطقة خراسان الكبرى',
                ],
                'thumbnail' => null,
                'video_url' => 'https://example.com/video3',
                'is_active' => true,
            ],
        ];

        foreach ($videos as $video) {
            Video::firstOrCreate(
                ['video_url' => $video['video_url']],
                $video
            );
        }
    }
}
