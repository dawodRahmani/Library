<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->string('instructor');
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('duration')->nullable();
            $table->integer('views')->default(0);
            $table->integer('year')->nullable();
            $table->string('status')->default('available');
            $table->json('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('video_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
