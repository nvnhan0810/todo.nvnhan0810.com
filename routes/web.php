<?php

use Illuminate\Support\Facades\Route;
use Modules\Identity\Presentation\Http\Controllers\AuthController;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::get('/auth/sso', [AuthController::class, 'redirectSso'])->name('auth.sso');
    Route::get('/auth/sso/callback', [AuthController::class, 'callbackSso'])->name('auth.sso.callback');
    Route::get('/auth/google', [AuthController::class, 'redirectGoogle'])->name('auth.google');
    Route::get('/auth/google/callback', [AuthController::class, 'callbackGoogle'])->name('auth.google.callback');
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::redirect('/', '/matrix')->middleware('auth');
