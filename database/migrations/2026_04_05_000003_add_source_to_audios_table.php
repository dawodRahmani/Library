<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audios', function (Blueprint $table) {
            // 'link' | 'upload'
            $table->string('audio_source')->default('link')->after('audio_url');
            $table->string('file_path')->nullable()->after('audio_source');
            $table->unsignedBigInteger('file_size')->nullable()->after('file_path');
        });
    }

    public function down(): void
    {
        Schema::table('audios', function (Blueprint $table) {
            $table->dropColumn(['audio_source', 'file_path', 'file_size']);
        });
    }
};
