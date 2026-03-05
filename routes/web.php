<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\TicketController;
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

    Route::get('/sucursales/{branch}/departamentos', [DepartmentController::class, 'index'])->name('departments.index');
    Route::post('/sucursales/{branch}/departamentos', [DepartmentController::class, 'store'])->name('departments.store');
    Route::delete('/departamentos/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');

    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');
    Route::patch('/tickets/{ticket}', [TicketController::class, 'update'])->name('tickets.update');
});

require __DIR__.'/auth.php';
