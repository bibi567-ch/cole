<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AcademicController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;

// ==================== RUTAS PÚBLICAS ====================
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// ==================== RUTAS PROTEGIDAS (JWT) ====================
Route::middleware('auth.jwt')->group(function () {
    
    // Perfil de usuario
    Route::get('profile', [AuthController::class, 'profile']);
    
    // MÓDULO ACADÉMICO (RF02, RF03, RF01)
    Route::prefix('academic')->group(function () {
        
        // Rutas de visualización para el Estudiante/Padre
        Route::get('my-grades', [AcademicController::class, 'viewMyGrades']);
        Route::get('my-attendance', [AcademicController::class, 'viewMyAttendance']);
        
        // Rutas de gestión (Solo para Docentes)
        Route::post('grade', [AcademicController::class, 'createGrade'])->middleware('can:is-teacher');
        Route::post('attendance', [AcademicController::class, 'createAttendance'])->middleware('can:is-teacher');
    });
    // ... (dentro de Route::middleware('auth.jwt')->group(function () { ... }))

    // MÓDULO ACADÉMICO
    Route::prefix('academic')->group(function () {
        // Rutas de visualización (Estudiante/Padre)
        Route::get('my-grades', [AcademicController::class, 'viewMyGrades']);
        // ...
        
        // Rutas de GESTIÓN (Solo para Docentes)
        Route::get('students', [AcademicController::class, 'listStudents'])->middleware('can:is-teacher'); // <-- NUEVA RUTA
        Route::post('grade', [AcademicController::class, 'createGrade'])->middleware('can:is-teacher');
        Route::post('attendance', [AcademicController::class, 'createAttendance'])->middleware('can:is-teacher');
    });
    
    // MÓDULO DE SERVICIOS (RF07, RF09)
    // Aquí irían las rutas del ServiceController
});