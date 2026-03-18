<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete();
            $table->enum('type', ['stock_in', 'stock_out', 'waste', 'adjustment']);
            $table->decimal('quantity', 10, 2);
            $table->enum('unit', ['kg', 'liter', 'piece', 'box', 'bag'])->default('kg');
            $table->unsignedInteger('cost_per_unit')->nullable();
            $table->unsignedInteger('total_cost')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_transactions');
    }
};
