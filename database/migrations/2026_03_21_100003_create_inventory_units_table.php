<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_units', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        $defaults = [
            ['name' => 'کیلوگرم', 'slug' => 'kg',    'created_at' => now(), 'updated_at' => now()],
            ['name' => 'لیتر',    'slug' => 'liter', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'عدد',     'slug' => 'piece', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'جعبه',    'slug' => 'box',   'created_at' => now(), 'updated_at' => now()],
            ['name' => 'بوجی',    'slug' => 'bag',   'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('inventory_units')->insert($defaults);

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->unsignedBigInteger('inventory_unit_id')->nullable()->after('inventory_category_id');
        });

        $units = DB::table('inventory_units')->pluck('id', 'slug');
        foreach ($units as $slug => $id) {
            DB::table('inventory_items')->where('unit', $slug)->update(['inventory_unit_id' => $id]);
        }
    }

    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropColumn('inventory_unit_id');
        });

        Schema::dropIfExists('inventory_units');
    }
};
