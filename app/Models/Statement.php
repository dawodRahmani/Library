<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Statement extends Model
{
    protected $fillable = [
        'type', 'title', 'body', 'media_source', 'media_url',
        'file_path', 'file_size', 'thumbnail',
        'published_at', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'title'        => 'array',
            'body'         => 'array',
            'published_at' => 'date',
            'is_active'    => 'boolean',
            'file_size'    => 'integer',
        ];
    }
}
