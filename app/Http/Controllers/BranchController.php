<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    /**
     * Muestra la lista de sucursales de una empresa específica.
     * GET /empresas/{tenant}/sucursales
     */
    public function index($tenantId)
    {
        // Validamos que la empresa exista
        $empresa = Tenant::findOrFail($tenantId);
        
        // Traemos las sucursales de esta empresa, ordenadas por nombre
        $sucursales = Branch::where('tenant_id', $tenantId)
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Branches/Index', [
            'empresa' => $empresa,
            'sucursales' => $sucursales
        ]);
    }

    /**
     * Guarda una nueva sucursal.
     * POST /empresas/{tenant}/sucursales
     */
    public function store(Request $request, $tenantId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        Branch::create([
            'tenant_id' => $tenantId,
            'name' => $request->name,
            'location' => $request->location,
            'timezone' => 'America/Panama', // Valor por defecto para tu SaaS
            'is_active' => true,
        ]);

        return redirect()->back();
    }

    /**
     * Actualiza una sucursal existente.
     * PUT /sucursales/{branch}
     */
    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        $branch->update([
            'name' => $request->name,
            'location' => $request->location,
        ]);

        return redirect()->back();
    }

    /**
     * Elimina una sucursal.
     * DELETE /sucursales/{branch}
     */
    public function destroy($id)
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();

        return redirect()->back();
    }
}
