<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'group', 'value'];

    protected function casts(): array
    {
        return [
            'value' => 'array',
        ];
    }

    /** Get a setting value, decoded from JSON. */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = Cache::remember("site_setting:{$key}", 300, function () use ($key) {
            return static::where('key', $key)->first();
        });

        return $setting?->value ?? $default;
    }

    /** Set (upsert) a setting value. */
    public static function set(string $key, mixed $value, string $group = 'general'): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value, 'group' => $group]);
        Cache::forget("site_setting:{$key}");
    }

    /** Return all settings as a keyed array. */
    public static function allKeyed(): array
    {
        return static::all()->mapWithKeys(fn ($s) => [$s->key => $s->value])->toArray();
    }
}
