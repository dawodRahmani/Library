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

            'manager' => array_values(array_filter(
                $all,
                fn ($p) => ! str_starts_with($p, 'users.') && $p !== 'settings.manage',
            )),

            'waiter' => [
                'orders.view', 'orders.create',
                'tables.view',
                'menu.view',
                'kitchen.view',
            ],

            'chef' => [
                'kitchen.view',
                'orders.view', 'orders.manage_status',
                'menu.view',
                'inventory.view',
            ],

            'cashier' => [
                'orders.view', 'orders.manage_status',
                'expenses.view', 'expenses.create',
                'reports.view',
                'finance.view',
            ],
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
