<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => inertia('welcome'))->name('home');
Route::get('/articles', fn () => inertia('articles'))->name('articles');
Route::get('/articles/{slug}', fn ($slug) => inertia('articles'))->name('articles.show');
Route::get('/dar-ul-ifta', fn () => inertia('dar-ul-ifta'))->name('dar-ul-ifta');
Route::get('/audio', fn () => inertia('audio'))->name('audio');
Route::get('/jihad', fn () => inertia('jihad'))->name('jihad');
Route::get('/fikr', fn () => inertia('fikr'))->name('fikr');
Route::get('/majalla', fn () => inertia('majalla'))->name('majalla');
Route::get('/about', fn () => inertia('about'))->name('about');
Route::get('/contact', fn () => inertia('contact'))->name('contact');
Route::get('/library', [BookController::class, 'index'])->name('library.index');
Route::get('/library/videos', fn () => inertia('library/videos'))->name('library.videos');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Users ──────────────────────────────────────────────────
    Route::middleware('permission:users.view')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->middleware('permission:users.create')->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->middleware('permission:users.edit')->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->middleware('permission:users.delete')->name('users.destroy');
        Route::patch('users/{user}/toggle-active', [UserController::class, 'toggleActive'])->middleware('permission:users.edit')->name('users.toggle-active');
    });

    // ── Roles & Permissions ────────────────────────────────────
    Route::middleware('permission:settings.manage')->group(function () {
        Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
        Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
        Route::patch('roles/{role}/permissions', [RoleController::class, 'syncPermissions'])->name('roles.permissions');
        Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');
    });
});

require __DIR__.'/settings.php';
