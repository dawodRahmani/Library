<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('cover_image');
            $table->string('file_type')->nullable()->after('file_path'); // e.g. pdf, epub
            $table->unsignedBigInteger('file_size')->nullable()->after('file_type'); // bytes
        });
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn(['file_path', 'file_type', 'file_size']);
        });
    }
};
