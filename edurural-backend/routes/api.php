<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AcademicController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;

// Rutas de Autenticación (Públicas)
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Rutas Protegidas (Requieren JWT)
Route::middleware('auth.jwt')->group(function () {
    Route::get('profile', [AuthController::class, 'profile']); 
    
    // Aquí irían las rutas AcademicController y ServiceController
});