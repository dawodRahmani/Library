<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::withCount('users')
            ->with('permissions')
            ->orderBy('name')
            ->get()
            ->map(fn ($r) => [
                'id'          => $r->id,
                'name'        => $r->name,
                'permissions' => $r->permissions->map(fn ($p) => [
                    'id'    => $p->id,
                    'name'  => $p->name,
                    'group' => explode('.', $p->name)[0],
                ])->values(),
                'users_count' => $r->users_count,
                'created_at'  => $r->created_at->toDateTimeString(),
                'updated_at'  => $r->updated_at->toDateTimeString(),
            ]);

        $allPermissions = Permission::orderBy('name')
            ->get()
            ->map(fn ($p) => [
                'id'    => $p->id,
                'name'  => $p->name,
                'group' => explode('.', $p->name)[0],
            ]);

        return Inertia::render('roles/index', [
            'roles'          => $roles,
            'allPermissions' => $allPermissions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:50', 'unique:roles,name'],
        ]);

        Role::create(['name' => $data['name'], 'guard_name' => 'web']);

        return back();
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:50', "unique:roles,name,{$role->id}"],
        ]);

        $role->update(['name' => $data['name']]);

        return back();
    }

    public function destroy(Role $role): RedirectResponse
    {
        if ($role->name === 'admin') {
            return back()->withErrors(['role' => 'The admin role cannot be deleted.']);
        }

        if ($role->users()->count() > 0) {
            return back()->withErrors(['role' => 'Cannot delete a role that has users assigned to it.']);
        }

        $role->delete();

        return back();
    }

    public function syncPermissions(Request $request, Role $role): RedirectResponse
    {
        $data = $request->validate([
            'permissions'   => ['required', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role->syncPermissions($data['permissions']);

        return back();
    }
}
