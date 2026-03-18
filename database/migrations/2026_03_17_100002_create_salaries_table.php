<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->char('month', 7); // e.g. '1404-12'
            $table->unsignedInteger('base_amount')->default(0);
            $table->unsignedInteger('bonuses')->default(0);
            $table->unsignedInteger('deductions')->default(0);
            $table->unsignedInteger('amount'); // final = base + bonuses - deductions
            $table->enum('status', ['paid', 'pending', 'partial'])->default('pending');
            $table->date('payment_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salaries');
    }
};
