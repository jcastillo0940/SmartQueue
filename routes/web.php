<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\DepartmentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. Pantalla de Bienvenida (Landing)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// 2. Dashboard General (Tickets de hoy)
Route::get('/dashboard', [TicketController::class, 'dashboard'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// 3. GRUPO DE RUTAS PROTEGIDAS (Solo para usuarios autenticados)
Route::middleware('auth')->group(function () {
    
    // Perfil de Usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- MÓDULO SaaS: GESTIÓN DE EMPRESAS (TENANTS) ---
    Route::get('/empresas', [TenantController::class, 'index'])->name('empresas.index');
    Route::post('/empresas', [TenantController::class, 'store'])->name('empresas.store');

    // --- MÓDULO SaaS: GESTIÓN DE SUCURSALES (BRANCHES) ---
    // Estas rutas dependen de una empresa específica
    Route::get('/empresas/{tenant}/sucursales', [BranchController::class, 'index'])->name('branches.index');
    Route::post('/empresas/{tenant}/sucursales', [BranchController::class, 'store'])->name('branches.store');
    
    // Rutas para editar y eliminar sucursales individualmente
    Route::put('/sucursales/{branch}', [BranchController::class, 'update'])->name('branches.update');
    Route::delete('/sucursales/{branch}', [BranchController::class, 'destroy'])->name('branches.destroy');

    // --- MÓDULO SaaS: GESTIÓN DE DEPARTAMENTOS ---
    Route::get('/sucursales/{branch}/departamentos', [DepartmentController::class, 'index'])->name('departments.index');
    Route::post('/sucursales/{branch}/departamentos', [DepartmentController::class, 'store'])->name('departments.store');
    Route::delete('/departamentos/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');

    // --- OPERACIÓN DE TURNOS (BASE ESTADOS) ---
    Route::post('/tickets/call-next', [TicketController::class, 'callNext'])->name('tickets.call-next');
    Route::post('/tickets/{ticket}/serving', [TicketController::class, 'startServing'])->name('tickets.start-serving');
    Route::post('/tickets/{ticket}/recall', [TicketController::class, 'recall'])->name('tickets.recall');
    Route::post('/tickets/{ticket}/no-show', [TicketController::class, 'markNoShow'])->name('tickets.no-show');
    Route::post('/tickets/{ticket}/serve', [TicketController::class, 'markServed'])->name('tickets.serve');
});

require __DIR__.'/auth.php';
