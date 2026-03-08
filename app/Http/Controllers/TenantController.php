<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index()
    {
        $empresas = Tenant::latest()->get();

        return Inertia::render('Tenants/Index', [
            'empresas' => $empresas
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Tenant::create([
            'name' => $request->name,
        ]);

        return redirect()->back();
    }
}
