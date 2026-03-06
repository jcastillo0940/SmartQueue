<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TenantController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified', 'tenant'])->group(function (): void {
    Route::get('/dashboard', [TicketController::class, 'dashboard'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/empresas', [TenantController::class, 'index'])->name('empresas.index');
    Route::post('/empresas', [TenantController::class, 'store'])->name('empresas.store');

    Route::get('/empresas/{tenant}/sucursales', [BranchController::class, 'index'])->name('branches.index');
    Route::post('/empresas/{tenant}/sucursales', [BranchController::class, 'store'])->name('branches.store');
    Route::put('/sucursales/{branch}', [BranchController::class, 'update'])->name('branches.update');
    Route::delete('/sucursales/{branch}', [BranchController::class, 'destroy'])->name('branches.destroy');

    // --- MÓDULO SaaS: GESTIÓN DE DEPARTAMENTOS ---
    Route::get('/sucursales/{branch}/departamentos', [DepartmentController::class, 'index'])->name('departments.index');
    Route::post('/sucursales/{branch}/departamentos', [DepartmentController::class, 'store'])->name('departments.store');
    Route::delete('/departamentos/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');

    // --- MÓDULO SaaS: GESTIÓN DE STAFF ---
    Route::get('/departamentos/{department}/staff', [StaffController::class, 'index'])->name('staff.index');
    Route::post('/departamentos/{department}/staff', [StaffController::class, 'store'])->name('staff.store');
    Route::put('/staff/{staff}', [StaffController::class, 'update'])->name('staff.update');
    Route::delete('/staff/{staff}', [StaffController::class, 'destroy'])->name('staff.destroy');

    // --- OPERACIÓN DE TURNOS (BASE ESTADOS) ---
    Route::post('/tickets/call-next', [TicketController::class, 'callNext'])->name('tickets.call-next');
    Route::post('/tickets/{ticket}/recall', [TicketController::class, 'recall'])->name('tickets.recall');
    Route::post('/tickets/{ticket}/no-show', [TicketController::class, 'markNoShow'])->name('tickets.no-show');
    Route::post('/tickets/{ticket}/serve', [TicketController::class, 'markServed'])->name('tickets.serve');
});

require __DIR__.'/auth.php';
