<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected $fillable = [
        'name', 'role', 'phone', 'hire_date', 'is_active', 'base_salary',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function salaries(): HasMany
    {
        return $this->hasMany(Salary::class);
    }
}
