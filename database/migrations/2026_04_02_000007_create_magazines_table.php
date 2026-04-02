<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('magazines', function (Blueprint $table) {
            $table->id();
            $table->integer('number');
            $table->json('title');
            $table->string('theme')->nullable();
            $table->string('year');
            $table->integer('article_count')->default(0);
            $table->json('description')->nullable();
            $table->boolean('featured')->default(false);
            $table->json('articles')->nullable();
            $table->string('cover_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('magazines');
    }
};
