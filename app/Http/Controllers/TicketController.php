<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Ticket;
use App\Models\Staff;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $branches = Branch::all();
        $departments = $request->filled('branch_id') 
            ? Department::where('branch_id', $request->branch_id)->get() 
            : [];
        
        $staff = $request->filled('department_id')
            ? Staff::where('department_id', $request->department_id)->get()
            : [];

        $query = Ticket::query()
            ->with(['department', 'calledBy'])
            ->active()
            ->whereDate('created_at', today());

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        $turnosActivos = $query->orderByDesc('priority')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Dashboard', [
            'turnos' => $turnosActivos,
            'branches' => $branches,
            'departments' => $departments,
            'staffList' => $staff,
            'filters' => $request->only(['branch_id', 'department_id', 'staff_id']),
        ]);
    }

    // --- VISTA PÚBLICA PARA TV/MONITOR ---
    public function publicDisplay(Branch $branch)
    {
        // Obtenemos los últimos tickets llamados o en atención
        $llamados = Ticket::query()
            ->with(['department', 'calledBy'])
            ->where('branch_id', $branch->id)
            ->whereIn('status', [Ticket::STATUS_CALLING, Ticket::STATUS_SERVING])
            ->whereDate('created_at', today())
            ->orderByDesc('called_at')
            ->limit(5)
            ->get();

        return Inertia::render('PublicDisplay/Index', [
            'branch' => $branch,
            'llamados' => $llamados
        ]);
    }

    public function kiosk(Branch $branch)
    {
        $departments = $branch->departments()->where('is_active', true)->get();

        return Inertia::render('Kiosk/Index', [
            'branch' => $branch,
            'departments' => $departments,
        ]);
    }

    public function store(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'customer_phone' => ['nullable', 'string', 'max:20'],
        ]);

        $department = Department::findOrFail($validated['department_id']);

        $todayTicketsCount = Ticket::query()
            ->where('department_id', $department->id)
            ->whereDate('created_at', today())
            ->count();

        $nextNumber = $todayTicketsCount + 1;
        $ticketNumber = $department->prefix . '-' . str_pad($nextNumber, 2, '0', STR_PAD_LEFT);

        $ticket = Ticket::create([
            'tenant_id' => $branch->tenant_id,
            'branch_id' => $branch->id,
            'department_id' => $department->id,
            'number' => $ticketNumber,
            'source' => 'KIOSK',
            'customer_phone' => $validated['customer_phone'] ?? null,
            'status' => Ticket::STATUS_WAITING,
            'priority' => 0,
        ]);

        return redirect()->back()->with('success', "Turno generado: {$ticket->number}");
    }

    public function callNext(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'staff_id' => ['required', 'integer', 'exists:staff,id'],
        ]);

        DB::transaction(function () use ($validated): void {
            $ticket = Ticket::query()
                ->where('department_id', $validated['department_id'])
                ->where('status', Ticket::STATUS_WAITING)
                ->orderByDesc('priority')
                ->orderBy('created_at')
                ->lockForUpdate()
                ->first();

            if (! $ticket) {
                return;
            }

            $ticket->update([
                'status' => Ticket::STATUS_CALLING,
                'called_by' => $validated['staff_id'],
                'assigned_staff_id' => $validated['staff_id'],
                'call_count' => $ticket->call_count + 1,
                'called_at' => now(),
            ]);
        });

        return back();
    }

    public function recall(Request $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validate([
            'staff_id' => ['nullable', 'integer', 'exists:staff,id'],
        ]);

        if (! in_array($ticket->status, [Ticket::STATUS_CALLING, Ticket::STATUS_SERVING], true)) {
            return back()->withErrors(['ticket' => 'Solo se puede re-llamar tickets en CALLING o SERVING.']);
        }

        $ticket->update([
            'status' => Ticket::STATUS_CALLING,
            'called_by' => $validated['staff_id'] ?? $ticket->called_by,
            'assigned_staff_id' => $validated['staff_id'] ?? $ticket->assigned_staff_id,
            'call_count' => $ticket->call_count + 1,
            'called_at' => now(),
        ]);

        return back();
    }

    public function markNoShow(Ticket $ticket): RedirectResponse
    {
        if (! in_array($ticket->status, [Ticket::STATUS_WAITING, Ticket::STATUS_CALLING], true)) {
            return back()->withErrors(['ticket' => 'Solo se puede marcar NO_SHOW desde WAITING o CALLING.']);
        }

        $ticket->update([
            'status' => Ticket::STATUS_NO_SHOW,
            'no_show_at' => now(),
        ]);

        return back();
    }

    public function markServed(Ticket $ticket): RedirectResponse
    {
        if (! in_array($ticket->status, [Ticket::STATUS_CALLING, Ticket::STATUS_SERVING], true)) {
            return back()->withErrors(['ticket' => 'Solo se puede finalizar tickets en CALLING o SERVING.']);
        }

        $ticket->update([
            'status' => Ticket::STATUS_SERVED,
            'served_at' => now(),
            'serving_started_at' => $ticket->serving_started_at ?? now(),
        ]);

        return back();
    }
}
