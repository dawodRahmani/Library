<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('unit', ['kg', 'liter', 'piece', 'box', 'bag'])->default('kg');
            $table->unsignedInteger('cost_per_unit')->default(0);
            $table->decimal('current_stock', 10, 2)->default(0);
            $table->decimal('min_stock_level', 10, 2)->default(0);
            $table->string('category')->default('other');
            $table->boolean('is_active')->default(true);
            $table->date('last_restocked')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
