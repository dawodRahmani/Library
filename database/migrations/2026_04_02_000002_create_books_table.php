<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->string('author');
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->integer('year')->nullable();
            $table->string('isbn')->nullable();
            $table->string('status')->default('available');
            $table->integer('copies')->default(1);
            $table->integer('available')->default(1);
            $table->integer('rating')->default(0);
            $table->json('description')->nullable();
            $table->integer('pages')->nullable();
            $table->string('publisher')->nullable();
            $table->string('cover_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
