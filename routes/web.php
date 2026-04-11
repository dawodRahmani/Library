<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\AudioController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FatwaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MagazineController;
use App\Http\Controllers\SiteSettingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\StatementController;
use App\Http\Controllers\VideoController;
use Illuminate\Support\Facades\Route;

// ── Public pages ──────────────────────────────────────────────
Route::get('/search', [SearchController::class, 'search'])->name('search');
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/library', [BookController::class, 'index'])->name('library.index');
Route::get('/library/books/{book}/reader', [BookController::class, 'reader'])->name('library.books.reader');
Route::get('/library/books/{book}/read', [BookController::class, 'read'])->name('library.books.read');
Route::get('/library/books/{book}/download', [BookController::class, 'download'])->name('library.books.download');
Route::get('/library/videos', [VideoController::class, 'index'])->name('library.videos');
Route::get('/library/videos/{video}/stream', [VideoController::class, 'stream'])->name('library.videos.stream');
Route::get('/library/videos/{video}/download', [VideoController::class, 'download'])->name('library.videos.download');
Route::get('/audio', [AudioController::class, 'index'])->name('audio');
Route::get('/audio/{audio}/stream', [AudioController::class, 'stream'])->name('audio.stream');
Route::get('/audio/{audio}/download', [AudioController::class, 'download'])->name('audio.download');
Route::get('/dar-ul-ifta', [FatwaController::class, 'index'])->name('dar-ul-ifta');
Route::get('/articles', [ArticleController::class, 'index'])->name('articles');
Route::get('/articles/{slug}', fn ($slug) => inertia('articles'))->name('articles.show');
Route::get('/majalla', [MagazineController::class, 'index'])->name('majalla');
Route::get('/majalla/{magazine}/reader', [MagazineController::class, 'reader'])->name('majalla.reader');
Route::get('/majalla/{magazine}/read', [MagazineController::class, 'read'])->name('majalla.read');
Route::get('/majalla/{magazine}/download', [MagazineController::class, 'download'])->name('majalla.download');
Route::get('/bayania', [StatementController::class, 'index'])->name('bayania');
Route::get('/bayania/{statement}', [StatementController::class, 'show'])->name('bayania.show');
Route::get('/fikr', fn () => inertia('fikr'))->name('fikr');
Route::get('/about', fn () => inertia('about'))->name('about');
Route::get('/contact', fn () => inertia('contact'))->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// ── Authenticated routes ──────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Users (admin only) ─────────────────────────────────────
    Route::middleware('permission:users.view')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::patch('users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');
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
        Route::get('admin/articles/create', [ArticleController::class, 'create'])->middleware('permission:articles.create')->name('admin.articles.create');
        Route::get('admin/articles/{article}/edit', [ArticleController::class, 'editForm'])->middleware('permission:articles.edit')->name('admin.articles.edit');
        Route::post('admin/articles', [ArticleController::class, 'store'])->middleware('permission:articles.create')->name('admin.articles.store');
        Route::post('admin/articles/upload-image', [ArticleController::class, 'uploadImage'])->middleware('permission:articles.create')->name('admin.articles.upload-image');
        Route::put('admin/articles/{article}', [ArticleController::class, 'update'])->middleware('permission:articles.edit')->name('admin.articles.update');
        Route::delete('admin/articles/{article}', [ArticleController::class, 'destroy'])->middleware('permission:articles.delete')->name('admin.articles.destroy');
    });

    // ── Statements (بیانیه) ────────────────────────────────────
    Route::middleware('permission:fatwas.view')->group(function () {
        Route::get('admin/statements', [StatementController::class, 'adminIndex'])->name('admin.statements.index');
        Route::get('admin/statements/create', [StatementController::class, 'create'])->name('admin.statements.create');
        Route::get('admin/statements/{statement}/edit', [StatementController::class, 'editForm'])->name('admin.statements.edit');
        Route::post('admin/statements', [StatementController::class, 'store'])->name('admin.statements.store');
        Route::put('admin/statements/{statement}', [StatementController::class, 'update'])->name('admin.statements.update');
        Route::delete('admin/statements/{statement}', [StatementController::class, 'destroy'])->name('admin.statements.destroy');
    });

    // ── Magazines ──────────────────────────────────────────────
    Route::middleware('permission:magazines.view')->group(function () {
        Route::get('admin/magazines', [MagazineController::class, 'adminIndex'])->name('admin.magazines.index');
        Route::post('admin/magazines', [MagazineController::class, 'store'])->middleware('permission:magazines.create')->name('admin.magazines.store');
        Route::put('admin/magazines/{magazine}', [MagazineController::class, 'update'])->middleware('permission:magazines.edit')->name('admin.magazines.update');
        Route::delete('admin/magazines/{magazine}', [MagazineController::class, 'destroy'])->middleware('permission:magazines.delete')->name('admin.magazines.destroy');
    });

    // ── Site Settings ──────────────────────────────────────────
    Route::middleware('permission:settings.manage')->group(function () {
        Route::get('admin/site-settings', [SiteSettingController::class, 'adminIndex'])->name('admin.site-settings.index');
        Route::post('admin/site-settings', [SiteSettingController::class, 'bulkUpdate'])->name('admin.site-settings.update');
        Route::post('admin/site-settings/logo', [SiteSettingController::class, 'uploadLogo'])->name('admin.site-settings.logo');
        Route::delete('admin/site-settings/logo', [SiteSettingController::class, 'removeLogo'])->name('admin.site-settings.logo.remove');
    });

    // ── Contact Messages ───────────────────────────────────────
    Route::middleware('permission:settings.manage')->group(function () {
        Route::get('admin/messages', [ContactController::class, 'adminIndex'])->name('admin.messages.index');
        Route::patch('admin/messages/{message}/read', [ContactController::class, 'markRead'])->name('admin.messages.read');
        Route::patch('admin/messages/{message}/unread', [ContactController::class, 'markUnread'])->name('admin.messages.unread');
        Route::delete('admin/messages/{message}', [ContactController::class, 'destroy'])->name('admin.messages.destroy');
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
