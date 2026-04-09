<?php

namespace Database\Seeders;

use App\Models\Audio;
use App\Models\Category;
use Illuminate\Database\Seeder;

class AudioSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('type', 'audio')->first();
        if (!$category) {
            return;
        }

        $audios = [
            [
                'title' => [
                    'da' => 'سخنرانی درباره توحید',
                    'en' => 'Lecture on Tawheed',
                    'ar' => 'محاضرة في التوحيد',
                ],
                'description' => [
                    'da' => 'سخنرانی جامع درباره اهمیت توحید در اسلام',
                    'en' => 'Comprehensive lecture on the importance of monotheism in Islam',
                    'ar' => 'محاضرة شاملة حول أهمية التوحيد في الإسلام',
                ],
                'author' => 'شیخ محمد',
                'category_id' => $category->id,
                'duration' => '1:15:30',
                'episodes' => 1,
                'audio_source' => 'link',
                'audio_url' => 'https://example.com/audio1.mp3',
                'is_active' => true,
            ],
            [
                'title' => [
                    'da' => 'پندهای اخلاقی',
                    'en' => 'Moral Advices',
                    'ar' => 'النصائح الأخلاقية',
                ],
                'description' => [
                    'da' => 'مجموعه پندهای اخلاقی از علمای اسلام',
                    'en' => 'Collection of moral advices from Islamic scholars',
                    'ar' => 'مجموعة من النصائح الأخلاقية من علماء الإسلام',
                ],
                'author' => 'دکتر کریمی',
                'category_id' => $category->id,
                'duration' => '45:20',
                'episodes' => 3,
                'audio_source' => 'link',
                'audio_url' => 'https://example.com/audio2.mp3',
                'is_active' => true,
            ],
            [
                'title' => [
                    'da' => 'نشید جهادی',
                    'en' => 'Jihadi Nasheed',
                    'ar' => 'نشيد جهادي',
                ],
                'description' => [
                    'da' => 'نشید الهام‌بخش درباره جهاد و مقاومت',
                    'en' => 'Inspirational nasheed about jihad and resistance',
                    'ar' => 'نشيد ملهم عن الجهاد والمقاومة',
                ],
                'author' => 'گروه انصار',
                'category_id' => $category->id,
                'duration' => '5:45',
                'episodes' => 1,
                'audio_source' => 'link',
                'audio_url' => 'https://example.com/audio3.mp3',
                'is_active' => true,
            ],
        ];

        foreach ($audios as $audio) {
            Audio::firstOrCreate(
                ['audio_url' => $audio['audio_url']],
                $audio
            );
        }
    }
}
