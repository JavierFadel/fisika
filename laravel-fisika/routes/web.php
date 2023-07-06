<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MapsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/maps', [MapsController::class, 'index'])->name('maps');
    Route::get('/traffic', [MapsController::class, 'traffic'])->name('traffic');
    Route::get('/instruction', [MapsController::class, 'time'])->name('instruction');
    Route::get('/avoid', [MapsController::class, 'avoid'])->name('avoid');
    Route::get('/galery', [MapsController::class, 'gallery'])->name('gallery');
});

require __DIR__.'/auth.php';
