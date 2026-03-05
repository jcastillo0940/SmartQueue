<?php

namespace App\Http\Controllers;

use App\Models\Tenant; // Tu modelo de Empresa
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantController extends Controller
{
    // 1. Mostrar la pantalla con la lista de empresas
    public function index()
    {
        // Traemos todas las empresas ordenadas por la más reciente
        $empresas = Tenant::latest()->get();

        return Inertia::render('Tenants/Index', [
            'empresas' => $empresas
        ]);
    }

    // 2. Guardar una nueva empresa
    public function store(Request $request)
    {
        // Validamos que envíen el nombre
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Creamos la empresa
        Tenant::create([
            'name' => $request->name,
        ]);

        // Recargamos la página
        return redirect()->back();
    }
}
