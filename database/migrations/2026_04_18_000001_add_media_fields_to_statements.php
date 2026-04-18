<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('statements', function (Blueprint $table) {
            $table->string('type', 16)->default('text')->after('id');
            $table->string('media_source', 16)->default('link')->after('body');
            $table->string('media_url', 1000)->nullable()->after('media_source');
            $table->string('file_path')->nullable()->after('media_url');
            $table->unsignedBigInteger('file_size')->nullable()->after('file_path');
            $table->string('thumbnail')->nullable()->after('file_size');
        });
    }

    public function down(): void
    {
        Schema::table('statements', function (Blueprint $table) {
            $table->dropColumn(['type', 'media_source', 'media_url', 'file_path', 'file_size', 'thumbnail']);
        });
    }
};
