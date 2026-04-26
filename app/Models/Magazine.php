<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Magazine extends Model
{
    protected $fillable = [
        'number',
        'title',
        'theme',
        'author',
        'year',
        'article_count',
        'description',
        'featured',
        'articles',
        'cover_image',
        'file_path',
        'file_size',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'title'       => 'array',
            'description' => 'array',
            'articles'    => 'array',
            'featured'    => 'boolean',
            'is_active'   => 'boolean',
        ];
    }
}
