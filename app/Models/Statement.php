<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Statement extends Model
{
    protected $fillable = ['title', 'body', 'published_at', 'is_active'];

    protected function casts(): array
    {
        return [
            'title'        => 'array',
            'body'         => 'array',
            'published_at' => 'date',
            'is_active'    => 'boolean',
        ];
    }
}
