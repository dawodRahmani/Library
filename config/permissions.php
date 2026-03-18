<?php

/**
 * Hardcoded permission list for رستورانت برتر.
 * Permissions are seeded from here — never created/deleted via UI.
 * Roles are dynamic and can be managed by admin.
 *
 * Format: 'group' => ['action1', 'action2', ...]
 * Generates permission names like: "group.action"
 */
return [
    'groups' => [
        'users'     => ['view', 'create', 'edit', 'delete'],
        'orders'    => ['view', 'create', 'edit', 'manage_status'],
        'menu'      => ['view', 'create', 'edit', 'delete'],
        'tables'    => ['view', 'create', 'edit', 'delete'],
        'kitchen'   => ['view'],
        'inventory' => ['view', 'create', 'edit', 'delete'],
        'expenses'  => ['view', 'create', 'edit', 'delete'],
        'employees' => ['view', 'create', 'edit', 'delete'],
        'salaries'  => ['view', 'create', 'edit', 'delete'],
        'reports'   => ['view'],
        'finance'   => ['view'],
        'settings'  => ['manage'],
    ],
];
