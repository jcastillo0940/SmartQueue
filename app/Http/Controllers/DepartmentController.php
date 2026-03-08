<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(int $branch): Response
    {
        $sucursal = Branch::query()->with('tenant')->findOrFail($branch);
        $departamentos = Department::query()
            ->where('branch_id', $sucursal->id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Departments/Index', [
            'sucursal' => $sucursal,
            'departamentos' => $departamentos,
        ]);
    }

    public function store(Request $request, int $branch): RedirectResponse
    {
        $sucursal = Branch::query()->findOrFail($branch);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'prefix' => ['nullable', 'string', 'max:5'],
        ]);

        Department::query()->create([
            'tenant_id' => $sucursal->tenant_id,
            'branch_id' => $sucursal->id,
            'name' => $validated['name'],
            'prefix' => strtoupper((string) ($validated['prefix'] ?? '')) ?: null,
            'is_active' => true,
        ]);

        return back();
    }

    public function destroy(int $department): RedirectResponse
    {
        Department::query()->findOrFail($department)->delete();

        return back();
    }
}
