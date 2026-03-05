<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function dashboard()
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

            $this->applyCall($ticket, $validated['staff_id'] ?? null);
        });

        return back();
    }

    public function startServing(Ticket $ticket): RedirectResponse
    {
        if ($ticket->status !== Ticket::STATUS_CALLING) {
            return back()->withErrors(['ticket' => 'Solo se puede iniciar atención desde CALLING.']);
        }

        $ticket->update([
            'status' => Ticket::STATUS_SERVING,
            'serving_started_at' => $ticket->serving_started_at ?? now(),
        ]);

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

        $this->applyCall($ticket, $validated['staff_id'] ?? $ticket->assigned_staff_id);

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

    private function applyCall(Ticket $ticket, ?int $staffId = null): void
    {
        $maxCalls = (int) config('smartqueue.tickets.max_calls_before_no_show', 3);
        $nextCallCount = $ticket->call_count + 1;

        if ($nextCallCount >= $maxCalls) {
            $ticket->update([
                'status' => Ticket::STATUS_NO_SHOW,
                'called_by' => $staffId,
                'assigned_staff_id' => $staffId,
                'call_count' => $nextCallCount,
                'called_at' => now(),
                'no_show_at' => now(),
            ]);

            return;
        }

        $ticket->update([
            'status' => Ticket::STATUS_CALLING,
            'called_by' => $staffId,
            'assigned_staff_id' => $staffId,
            'call_count' => $nextCallCount,
            'called_at' => now(),
        ]);
    }
}
