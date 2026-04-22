<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fatwas', function (Blueprint $table) {
            $table->string('type')->default('text')->after('category_id');
            $table->string('media_source')->nullable()->after('type');
            $table->string('media_url', 1000)->nullable()->after('media_source');
            $table->string('file_path')->nullable()->after('media_url');
            $table->unsignedBigInteger('file_size')->nullable()->after('file_path');
            $table->json('body')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('fatwas', function (Blueprint $table) {
            $table->dropColumn(['type', 'media_source', 'media_url', 'file_path', 'file_size', 'body']);
        });
    }
};
