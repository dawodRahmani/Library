<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Floor extends Model
{
    protected $fillable = ['name', 'description', 'color', 'order'];

    public function tables(): HasMany
    {
        return $this->hasMany(Table::class);
    }
}
