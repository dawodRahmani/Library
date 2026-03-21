<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create expense_categories table
        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');       // display name (Dari)
            $table->string('slug')->unique(); // machine key
            $table->timestamps();
        });

        // 2. Seed default categories (matching the old enum values)
        $defaults = [
            ['name' => 'مواد غذایی',  'slug' => 'groceries',   'created_at' => now(), 'updated_at' => now()],
            ['name' => 'کرایه',       'slug' => 'rent',        'created_at' => now(), 'updated_at' => now()],
            ['name' => 'برق',         'slug' => 'electricity', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'گاز',         'slug' => 'gas',         'created_at' => now(), 'updated_at' => now()],
            ['name' => 'لوازم',       'slug' => 'supplies',    'created_at' => now(), 'updated_at' => now()],
            ['name' => 'سایر',        'slug' => 'other',       'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('expense_categories')->insert($defaults);

        // 3. Add expense_category_id to expenses table
        Schema::table('expenses', function (Blueprint $table) {
            $table->unsignedBigInteger('expense_category_id')->nullable()->after('id');
        });

        // 4. Migrate existing data: map old slug-based category to new FK
        $categories = DB::table('expense_categories')->pluck('id', 'slug');
        foreach ($categories as $slug => $id) {
            DB::table('expenses')->where('category', $slug)->update(['expense_category_id' => $id]);
        }

        // 5. Default any remaining nulls to "other"
        $otherId = $categories['other'] ?? DB::table('expense_categories')->where('slug', 'other')->value('id');
        if ($otherId) {
            DB::table('expenses')->whereNull('expense_category_id')->update(['expense_category_id' => $otherId]);
        }
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn('expense_category_id');
        });

        Schema::dropIfExists('expense_categories');
    }
};
