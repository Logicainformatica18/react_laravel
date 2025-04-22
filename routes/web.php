<?php
    use App\Http\Controllers\TransferController;

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
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::get('/articles/{id}', [ArticleController::class, 'show']);
    Route::post('/articles/bulk-delete', [ArticleController::class, 'bulkDelete']);
    Route::get('/articles/export/excel', [ArticleController::class, 'exportExcel']);





    Route::get('/transfers/fetch', [TransferController::class, 'fetchPaginated'])->name('transfers.fetch');
    Route::post('/transfers', [TransferController::class, 'store'])->middleware(['auth', 'verified']);
    Route::get('/transfers', [TransferController::class, 'index'])->middleware(['auth', 'verified'])->name('transfers.index');
    Route::delete('/transfers/{id}', [TransferController::class, 'destroy']);
    Route::put('/transfers/{id}', [TransferController::class, 'update']);
    Route::get('/transfers/{id}', [TransferController::class, 'show']);
    Route::post('/transfers/bulk-delete', [TransferController::class, 'bulkDelete']);
    Route::get('/transfers/export/excel', [TransferController::class, 'exportExcel']);



});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
