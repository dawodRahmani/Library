<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with('roles')
            ->orderBy('name')
            ->get()
            ->map(fn ($u) => [
                'id'                => $u->id,
                'name'              => $u->name,
                'email'             => $u->email,
                'email_verified_at' => $u->email_verified_at?->toDateTimeString(),
                'is_active'         => (bool) $u->is_active,
                'roles'             => $u->roles->map(fn ($r) => [
                    'id'   => $r->id,
                    'name' => $r->name,
                ])->values(),
                'created_at'        => $u->created_at->toDateTimeString(),
                'updated_at'        => $u->updated_at->toDateTimeString(),
            ]);

        $roles = Role::orderBy('name')
            ->get()
            ->map(fn ($r) => ['id' => $r->id, 'name' => $r->name]);

        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'email', 'unique:users,email'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
            'role'                  => ['required', 'string', 'exists:roles,name'],
            'is_active'             => ['boolean'],
        ]);

        $user = User::create([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'password'  => Hash::make($data['password']),
            'is_active' => $data['is_active'] ?? true,
        ]);

        $user->assignRole($data['role']);

        return back();
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', "unique:users,email,{$user->id}"],
            'password'  => ['nullable', 'string', 'min:8', 'confirmed'],
            'role'      => ['required', 'string', 'exists:roles,name'],
            'is_active' => ['boolean'],
        ]);

        $updateData = [
            'name'      => $data['name'],
            'email'     => $data['email'],
            'is_active' => $data['is_active'] ?? $user->is_active,
        ];

        if (! empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $user->update($updateData);
        $user->syncRoles([$data['role']]);

        return back();
    }

    public function destroy(User $user): RedirectResponse
    {
        // Soft-deactivate — preserves order history and foreign key integrity
        $user->update(['is_active' => false]);

        return back();
    }

    public function toggleActive(User $user): RedirectResponse
    {
        $user->update(['is_active' => ! $user->is_active]);

        return back();
    }
}
