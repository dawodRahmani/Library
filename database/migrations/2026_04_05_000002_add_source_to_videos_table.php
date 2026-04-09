<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            // 'link' | 'youtube' | 'upload'
            $table->string('video_source')->default('link')->after('video_url');
            $table->string('file_path')->nullable()->after('video_source');
            $table->unsignedBigInteger('file_size')->nullable()->after('file_path');
        });
    }

    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn(['video_source', 'file_path', 'file_size']);
        });
    }
};
