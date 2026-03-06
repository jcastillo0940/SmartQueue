<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index(Department $department)
    {
        $staff = $department->staff()->get();

        return Inertia::render('Staff/Index', [
            'department' => $department,
            'branch' => $department->branch,
            'staff' => $staff,
        ]);
    }

    public function store(Request $request, Department $department)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $department->staff()->create([
            'tenant_id' => $department->tenant_id,
            'name' => $request->name,
            'status' => 'OFFLINE',
            'qr_hash' => uniqid('qr_'),
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Staff $staff)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|in:ONLINE,OFFLINE,ON_BREAK',
        ]);

        $staff->update($request->only('name', 'status'));

        return redirect()->back();
    }

    public function destroy(Staff $staff)
    {
        $staff->delete();

        return redirect()->back();
    }
}
