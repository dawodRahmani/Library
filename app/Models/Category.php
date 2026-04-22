<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'name' => 'array',
        ];
    }

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class);
    }

    public function audios(): HasMany
    {
        return $this->hasMany(Audio::class);
    }

    public function fatwas(): HasMany
    {
        return $this->hasMany(Fatwa::class);
    }
}
