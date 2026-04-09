<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::orderBy('name')
            ->get()
            ->map(fn ($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'is_active'  => (bool) $u->is_active,
                'created_at' => $u->created_at->toDateTimeString(),
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'email', 'unique:users,email'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
            'is_active'             => ['boolean'],
        ]);

        $user = User::create([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'password'  => Hash::make($data['password']),
            'is_active' => $data['is_active'] ?? true,
        ]);

        // New users get librarian role — full content access, no user/settings management
        $user->assignRole('librarian');

        return back()->with('success', 'کاربر با موفقیت ایجاد شد.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'email', "unique:users,email,{$user->id}"],
            'password'              => ['nullable', 'string', 'min:8', 'confirmed'],
            'is_active'             => ['boolean'],
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

        return back()->with('success', 'کاربر با موفقیت ویرایش شد.');
    }

    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting yourself
        abort_if($user->id === auth()->id(), 403, 'نمی‌توانید حساب خود را حذف کنید.');

        $user->delete();

        return back()->with('success', 'کاربر حذف شد.');
    }

    public function toggleActive(User $user): RedirectResponse
    {
        abort_if($user->id === auth()->id(), 403, 'نمی‌توانید حساب خود را غیرفعال کنید.');

        $user->update(['is_active' => ! $user->is_active]);

        return back();
    }
}
