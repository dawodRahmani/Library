<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AudioController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FatwaController;
use App\Http\Controllers\MagazineController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoController;
use Illuminate\Support\Facades\Route;

// ── Public pages ──────────────────────────────────────────────
Route::get('/', fn () => inertia('welcome'))->name('home');
Route::get('/library', [BookController::class, 'index'])->name('library.index');
Route::get('/library/videos', [VideoController::class, 'index'])->name('library.videos');
Route::get('/audio', [AudioController::class, 'index'])->name('audio');
Route::get('/dar-ul-ifta', [FatwaController::class, 'index'])->name('dar-ul-ifta');
Route::get('/articles', [ArticleController::class, 'index'])->name('articles');
Route::get('/articles/{slug}', fn ($slug) => inertia('articles'))->name('articles.show');
Route::get('/majalla', [MagazineController::class, 'index'])->name('majalla');
Route::get('/about', fn () => inertia('about'))->name('about');
Route::get('/contact', fn () => inertia('contact'))->name('contact');

// ── Authenticated routes ──────────────────────────────────────
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

    // ── Books ──────────────────────────────────────────────────
    Route::middleware('permission:books.view')->group(function () {
        Route::get('admin/books', [BookController::class, 'adminIndex'])->name('admin.books.index');
        Route::post('admin/books', [BookController::class, 'store'])->middleware('permission:books.create')->name('admin.books.store');
        Route::put('admin/books/{book}', [BookController::class, 'update'])->middleware('permission:books.edit')->name('admin.books.update');
        Route::delete('admin/books/{book}', [BookController::class, 'destroy'])->middleware('permission:books.delete')->name('admin.books.destroy');
    });

    // ── Videos ─────────────────────────────────────────────────
    Route::middleware('permission:videos.view')->group(function () {
        Route::get('admin/videos', [VideoController::class, 'adminIndex'])->name('admin.videos.index');
        Route::post('admin/videos', [VideoController::class, 'store'])->middleware('permission:videos.create')->name('admin.videos.store');
        Route::put('admin/videos/{video}', [VideoController::class, 'update'])->middleware('permission:videos.edit')->name('admin.videos.update');
        Route::delete('admin/videos/{video}', [VideoController::class, 'destroy'])->middleware('permission:videos.delete')->name('admin.videos.destroy');
    });

    // ── Audios ─────────────────────────────────────────────────
    Route::middleware('permission:audios.view')->group(function () {
        Route::get('admin/audios', [AudioController::class, 'adminIndex'])->name('admin.audios.index');
        Route::post('admin/audios', [AudioController::class, 'store'])->middleware('permission:audios.create')->name('admin.audios.store');
        Route::put('admin/audios/{audio}', [AudioController::class, 'update'])->middleware('permission:audios.edit')->name('admin.audios.update');
        Route::delete('admin/audios/{audio}', [AudioController::class, 'destroy'])->middleware('permission:audios.delete')->name('admin.audios.destroy');
    });

    // ── Fatwas ─────────────────────────────────────────────────
    Route::middleware('permission:fatwas.view')->group(function () {
        Route::get('admin/fatwas', [FatwaController::class, 'adminIndex'])->name('admin.fatwas.index');
        Route::post('admin/fatwas', [FatwaController::class, 'store'])->middleware('permission:fatwas.create')->name('admin.fatwas.store');
        Route::put('admin/fatwas/{fatwa}', [FatwaController::class, 'update'])->middleware('permission:fatwas.edit')->name('admin.fatwas.update');
        Route::delete('admin/fatwas/{fatwa}', [FatwaController::class, 'destroy'])->middleware('permission:fatwas.delete')->name('admin.fatwas.destroy');
    });

    // ── Articles ───────────────────────────────────────────────
    Route::middleware('permission:articles.view')->group(function () {
        Route::get('admin/articles', [ArticleController::class, 'adminIndex'])->name('admin.articles.index');
        Route::post('admin/articles', [ArticleController::class, 'store'])->middleware('permission:articles.create')->name('admin.articles.store');
        Route::put('admin/articles/{article}', [ArticleController::class, 'update'])->middleware('permission:articles.edit')->name('admin.articles.update');
        Route::delete('admin/articles/{article}', [ArticleController::class, 'destroy'])->middleware('permission:articles.delete')->name('admin.articles.destroy');
    });

    // ── Magazines ──────────────────────────────────────────────
    Route::middleware('permission:magazines.view')->group(function () {
        Route::get('admin/magazines', [MagazineController::class, 'adminIndex'])->name('admin.magazines.index');
        Route::post('admin/magazines', [MagazineController::class, 'store'])->middleware('permission:magazines.create')->name('admin.magazines.store');
        Route::put('admin/magazines/{magazine}', [MagazineController::class, 'update'])->middleware('permission:magazines.edit')->name('admin.magazines.update');
        Route::delete('admin/magazines/{magazine}', [MagazineController::class, 'destroy'])->middleware('permission:magazines.delete')->name('admin.magazines.destroy');
    });

    // ── Categories ─────────────────────────────────────────────
    Route::middleware('permission:categories.manage')->group(function () {
        Route::get('admin/categories', [CategoryController::class, 'index'])->name('admin.categories.index');
        Route::post('admin/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
        Route::put('admin/categories/{category}', [CategoryController::class, 'update'])->name('admin.categories.update');
        Route::delete('admin/categories/{category}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');
    });
});

require __DIR__.'/settings.php';
