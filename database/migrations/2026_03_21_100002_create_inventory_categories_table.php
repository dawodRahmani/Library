<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        $defaults = [
            ['name' => 'گوشت',        'slug' => 'meat',       'created_at' => now(), 'updated_at' => now()],
            ['name' => 'غلات',        'slug' => 'grains',     'created_at' => now(), 'updated_at' => now()],
            ['name' => 'سبزیجات',     'slug' => 'vegetables', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'روغنیات',     'slug' => 'oils',       'created_at' => now(), 'updated_at' => now()],
            ['name' => 'ادویه‌جات',   'slug' => 'spices',     'created_at' => now(), 'updated_at' => now()],
            ['name' => 'نوشیدنی‌ها',  'slug' => 'beverages',  'created_at' => now(), 'updated_at' => now()],
            ['name' => 'لبنیات',      'slug' => 'dairy',      'created_at' => now(), 'updated_at' => now()],
            ['name' => 'سایر',        'slug' => 'other',      'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('inventory_categories')->insert($defaults);

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->unsignedBigInteger('inventory_category_id')->nullable()->after('id');
        });

        $categories = DB::table('inventory_categories')->pluck('id', 'slug');
        foreach ($categories as $slug => $id) {
            DB::table('inventory_items')->where('category', $slug)->update(['inventory_category_id' => $id]);
        }

        $otherId = $categories['other'] ?? DB::table('inventory_categories')->where('slug', 'other')->value('id');
        if ($otherId) {
            DB::table('inventory_items')->whereNull('inventory_category_id')->update(['inventory_category_id' => $otherId]);
        }
    }

    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropColumn('inventory_category_id');
        });

        Schema::dropIfExists('inventory_categories');
    }
};
