<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index($branchId)
    {
        // Cargamos la sucursal con su empresa (tenant) para el breadcrumb
        $sucursal = Branch::with('tenant')->findOrFail($branchId);
        $departamentos = Department::where('branch_id', $branchId)->get();

        return Inertia::render('Departments/Index', [
            'sucursal' => $sucursal,
            'departamentos' => $departamentos
        ]);
    }

    public function store(Request $request, $branchId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'prefix' => 'nullable|string|max:5',
        ]);

        Department::create([
            'branch_id' => $branchId,
            'name' => $request->name,
            'prefix' => strtoupper($request->prefix),
            'is_active' => true,
        ]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        Department::findOrFail($id)->delete();
        return redirect()->back();
    }
}
