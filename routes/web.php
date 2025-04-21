<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ArticleController;
Route::get('/', function () {
    return redirect("dashboard");
    //return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');





    Route::get('/articles/fetch', [ArticleController::class, 'fetchPaginated'])->name('articles.fetch');
    Route::post('/articles', [ArticleController::class, 'store'])->middleware(['auth', 'verified']);

    Route::get('/articles', [ArticleController::class, 'index'])->middleware(['auth', 'verified'])->name('articles.index');


});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
