<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function index(int $tenant)
    {
        $sucursal_tenant = Tenant::findOrFail($tenant);
        $branches = Branch::where('tenant_id', $sucursal_tenant->id)->get();

        return Inertia::render('Branches/Index', [
            'empresa' => $sucursal_tenant,
            'sucursales' => $branches,
        ]);
    }

    public function store(Request $request, int $tenant)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'timezone' => 'required|string|max:255',
        ]);

        Branch::create([
            'tenant_id' => $tenant,
            'name' => $request->name,
            'location' => $request->location,
            'timezone' => $request->timezone,
            'is_active' => true,
        ]);

        return redirect()->back();
    }

    public function destroy(int $branch)
    {
        Branch::findOrFail($branch)->delete();
        return redirect()->back();
    }
}
