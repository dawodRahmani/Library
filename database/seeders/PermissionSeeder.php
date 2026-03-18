<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $groups = config('permissions.groups');

        foreach ($groups as $group => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name'       => "{$group}.{$action}",
                    'guard_name' => 'web',
                ]);
            }
        }
    }
}
