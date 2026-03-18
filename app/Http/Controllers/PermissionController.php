<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index(): Response
    {
        $permissions = Permission::with('roles')
            ->orderBy('name')
            ->get()
            ->map(fn ($p) => [
                'id'         => $p->id,
                'name'       => $p->name,
                'group'      => explode('.', $p->name)[0],
                'roles'      => $p->roles->map(fn ($r) => [
                    'id'   => $r->id,
                    'name' => $r->name,
                ])->values(),
                'created_at' => $p->created_at->toDateTimeString(),
                'updated_at' => $p->updated_at->toDateTimeString(),
            ]);

        return Inertia::render('permissions/index', [
            'permissions' => $permissions,
        ]);
    }
}
