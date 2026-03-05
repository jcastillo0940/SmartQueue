<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function dashboard()
    {
        // Buscamos los turnos de hoy usando TUS estados en inglés
        $turnosActivos = Ticket::whereIn('status', ['WAITING', 'CALLING', 'SERVING'])
            ->whereDate('created_at', today())
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Dashboard', [
            'turnos' => $turnosActivos
        ]);
    }
}
