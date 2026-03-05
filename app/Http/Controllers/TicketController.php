<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function dashboard(): Response
    {
        $turnosActivos = Ticket::query()
            ->active()
            ->whereDate('created_at', today())
            ->orderByDesc('priority')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Dashboard', [
            'turnos' => $turnosActivos,
        ]);
    }

    public function callNext(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'staff_id' => ['nullable', 'integer', 'exists:staff,id'],
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
                'called_by' => $validated['staff_id'] ?? null,
                'assigned_staff_id' => $validated['staff_id'] ?? null,
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
