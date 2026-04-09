<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('type', 'book')->first();
        if (!$category) {
            return;
        }

        $books = [
            [
                'title' => [
                    'da' => 'مختصر صحیح البخاری',
                    'en' => 'Abridged Sahih al-Bukhari',
                    'ar' => 'مختصر صحيح البخاري',
                ],
                'author' => 'امام بخاری',
                'category_id' => $category->id,
                'year' => 2023,
                'isbn' => '978-964-00-1234-5',
                'status' => 'available',
                'copies' => 10,
                'available' => 8,
                'rating' => 5,
                'description' => [
                    'da' => 'خلاصه‌ای از صحیح البخاری با ترجمه روان دری',
                    'en' => 'An abridged version of Sahih al-Bukhari with fluent Dari translation',
                    'ar' => 'مختصر من صحيح البخاري مع ترجمة سلسة',
                ],
                'pages' => 480,
                'publisher' => 'انتشارات رسالت',
                'cover_image' => null,
                'file_url'    => 'https://archive.org/download/sahih-al-bukhari-arabic/Sahih_Al_Bukhari_Arabic.pdf',
                'is_active'   => true,
            ],
            [
                'title' => [
                    'da' => 'ریاض الصالحین',
                    'en' => 'Riyad as-Salihin',
                    'ar' => 'رياض الصالحين',
                ],
                'author' => 'امام نووی',
                'category_id' => $category->id,
                'year' => 2022,
                'isbn' => '978-964-00-5678-9',
                'status' => 'available',
                'copies' => 15,
                'available' => 12,
                'rating' => 4,
                'description' => [
                    'da' => 'مجموعه‌ای از احادیث نبوی در موضوعات اخلاق و آداب',
                    'en' => 'A collection of Prophetic hadiths on ethics and manners',
                    'ar' => 'مجموعة من الأحاديث النبوية في الأخلاق والآداب',
                ],
                'pages' => 600,
                'publisher' => 'انتشارات رسالت',
                'cover_image' => null,
                'file_url'    => 'https://archive.org/download/riyad-us-saliheen/riyad-us-saliheen.pdf',
                'is_active'   => true,
            ],
            [
                'title' => [
                    'da' => 'فتح الباری شرح صحیح البخاری',
                    'en' => 'Fath al-Bari - Explanation of Sahih al-Bukhari',
                    'ar' => 'فتح الباري شرح صحيح البخاري',
                ],
                'author' => 'ابن حجر عسقلانی',
                'category_id' => $category->id,
                'year' => 2021,
                'isbn' => '978-964-00-9012-7',
                'status' => 'available',
                'copies' => 5,
                'available' => 5,
                'rating' => 5,
                'description' => [
                    'da' => 'شرح مفصل و ارزشمند بر صحیح البخاری',
                    'en' => 'A detailed and valuable commentary on Sahih al-Bukhari',
                    'ar' => 'شرح مفصل وقيم لصحيح البخاري',
                ],
                'pages' => 1200,
                'publisher' => 'انتشارات رسالت',
                'cover_image' => null,
                'file_url'    => 'https://archive.org/download/FathAlBariByIbnHajar/fath_al_bari_vol1.pdf',
                'is_active'   => true,
            ],
        ];

        foreach ($books as $book) {
            Book::firstOrCreate(
                ['isbn' => $book['isbn']],
                $book
            );
        }
    }
}
