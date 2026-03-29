<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $all = Permission::pluck('name')->all();

        $rolePermissions = [
            'admin' => $all,

            'librarian' => array_values(array_filter(
                $all,
                fn ($p) => ! str_starts_with($p, 'users.') && $p !== 'settings.manage',
            )),
        ];

        foreach ($rolePermissions as $roleName => $permissions) {
            $role = Role::firstOrCreate([
                'name'       => $roleName,
                'guard_name' => 'web',
            ]);

            $role->syncPermissions($permissions);
        }
    }
}
