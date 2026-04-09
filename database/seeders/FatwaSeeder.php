<?php

namespace Database\Seeders;

use App\Models\Fatwa;
use App\Models\Category;
use Illuminate\Database\Seeder;

class FatwaSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('type', 'fatwa')->first();
        if (!$category) {
            return;
        }

        $fatwas = [
            [
                'title' => [
                    'da' => 'حکم شرکت در انتخابات در نظام‌های کفر',
                    'en' => 'Ruling on participating in elections in disbelieving systems',
                    'ar' => 'حكم المشاركة في الانتخابات في أنظمة الكفر',
                ],
                'description' => [
                    'da' => 'فتوای مفصل درباره مشارکت در انتخابات در کشورهای تحت حاکمیت کفار',
                    'en' => 'Detailed fatwa regarding participation in elections in countries under disbelievers rule',
                    'ar' => 'فتوى مفصلة بشأن المشاركة في الانتخابات في البلدان تحت حكم الكفار',
                ],
                'author' => 'دارالافتاء رسالت',
                'category_id' => $category->id,
                'is_active' => true,
            ],
            [
                'title' => [
                    'da' => 'جهاد دفاعی در شرایط کنونی',
                    'en' => 'Defensive jihad in current circumstances',
                    'ar' => 'الجهاد الدفاعي في الأوضاع الراهنة',
                ],
                'description' => [
                    'da' => 'بررسی وجوب جهاد دفاعی در مواجهه با تجاوزات دشمن',
                    'en' => 'Examination of the obligation of defensive jihad in facing enemy aggressions',
                    'ar' => 'دراسة وجوب الجهاد الدفاعي في مواجهة عدوان الأعداء',
                ],
                'author' => 'شیخ احمد',
                'category_id' => $category->id,
                'is_active' => true,
            ],
            [
                'title' => [
                    'da' => 'حکم استفاده از رمزارزها',
                    'en' => 'Ruling on using cryptocurrencies',
                    'ar' => 'حكم استخدام العملات المشفرة',
                ],
                'description' => [
                    'da' => 'تحلیل فقهی استفاده از بیت‌کوین و سایر رمزارزها',
                    'en' => 'Jurisprudential analysis of using Bitcoin and other cryptocurrencies',
                    'ar' => 'تحليل فقهي لاستخدام البيتكوين وسائر العملات المشفرة',
                ],
                'author' => 'دکتر عمر',
                'category_id' => $category->id,
                'is_active' => true,
            ],
        ];

        foreach ($fatwas as $fatwa) {
            Fatwa::firstOrCreate(
                ['title' => $fatwa['title']],
                $fatwa
            );
        }
    }
}
