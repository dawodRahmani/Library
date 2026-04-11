<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Audio extends Model
{
    protected $table = 'audios';

    protected $fillable = [
        'title',
        'description',
        'author',
        'category_id',
        'duration',
        'episodes',
        'audio_url',
        'audio_source',
        'file_path',
        'file_size',
        'thumbnail',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'title'       => 'array',
            'description' => 'array',
            'is_active'   => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
