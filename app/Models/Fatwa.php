<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Fatwa extends Model
{
    protected $fillable = [
        'title',
        'description',
        'body',
        'author',
        'category_id',
        'type',
        'media_source',
        'media_url',
        'file_path',
        'file_size',
        'is_active',
        'thumbnail',
    ];

    protected function casts(): array
    {
        return [
            'title'       => 'array',
            'description' => 'array',
            'body'        => 'array',
            'is_active'   => 'boolean',
            'file_size'   => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
