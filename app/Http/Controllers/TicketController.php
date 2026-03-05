<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function dashboard(): Response
    {
        return $this->index();
    }

    public function index(): Response
    {
        $turnos = Ticket::query()
            ->with(['branch:id,name', 'department:id,name', 'staff:id,name'])
            ->orderByDesc('id')
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('Dashboard', [
            'turnos' => $turnos->items(),
            'pagination' => [
                'current_page' => $turnos->currentPage(),
                'last_page' => $turnos->lastPage(),
                'total' => $turnos->total(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = (int) $request->user()->tenant_id;

        $validated = $request->validate([
            'branch_id' => ['required', 'integer', Rule::exists('branches', 'id')],
            'department_id' => ['required', 'integer', Rule::exists('departments', 'id')],
            'staff_id' => ['nullable', 'integer', Rule::exists('staff', 'id')],
            'number' => ['required', 'string', 'max:20'],
            'status' => ['required', Rule::in($this->statuses())],
            'source' => ['required', Rule::in($this->sources())],
            'call_count' => ['nullable', 'integer', 'min:0'],
        ]);

        Ticket::query()->create([
            'uuid' => (string) Str::uuid(),
            'tenant_id' => $tenantId,
            'branch_id' => $validated['branch_id'],
            'department_id' => $validated['department_id'],
            'staff_id' => $validated['staff_id'] ?? null,
            'number' => $validated['number'],
            'status' => $validated['status'],
            'source' => $validated['source'],
            'call_count' => $validated['call_count'] ?? 0,
            'called_at' => $validated['status'] === Ticket::STATUS_CALLING ? now() : null,
            'serving_started_at' => $validated['status'] === Ticket::STATUS_SERVING ? now() : null,
            'served_at' => $validated['status'] === Ticket::STATUS_SERVED ? now() : null,
            'cancelled_at' => $validated['status'] === Ticket::STATUS_CANCELLED ? now() : null,
        ]);

        return back();
    }

    public function update(Request $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in($this->statuses())],
            'staff_id' => ['nullable', 'integer', Rule::exists('staff', 'id')],
        ]);

        $nextStatus = $validated['status'];

        if (! $this->isValidTransition($ticket->status, $nextStatus)) {
            return back()->withErrors([
                'status' => 'Transición de estado no permitida.',
            ]);
        }

        $attributes = [
            'status' => $nextStatus,
            'staff_id' => $validated['staff_id'] ?? $ticket->staff_id,
        ];

        if ($nextStatus === Ticket::STATUS_CALLING) {
            $attributes['call_count'] = $ticket->call_count + 1;
            $attributes['called_at'] = now();
        }

        if ($nextStatus === Ticket::STATUS_SERVING) {
            $attributes['serving_started_at'] = $ticket->serving_started_at ?? now();
        }

        if ($nextStatus === Ticket::STATUS_SERVED) {
            $attributes['served_at'] = now();
            $attributes['serving_started_at'] = $ticket->serving_started_at ?? now();
        }

        if ($nextStatus === Ticket::STATUS_CANCELLED) {
            $attributes['cancelled_at'] = now();
        }

        $ticket->update($attributes);

        return back();
    }

    /**
     * @return list<string>
     */
    private function statuses(): array
    {
        return [
            Ticket::STATUS_WAITING,
            Ticket::STATUS_CALLING,
            Ticket::STATUS_SERVING,
            Ticket::STATUS_SERVED,
            Ticket::STATUS_NO_SHOW,
            Ticket::STATUS_CANCELLED,
        ];
    }

    /**
     * @return list<string>
     */
    private function sources(): array
    {
        return [
            Ticket::SOURCE_WEB,
            Ticket::SOURCE_WHATSAPP,
            Ticket::SOURCE_KIOSK,
        ];
    }

    private function isValidTransition(string $from, string $to): bool
    {
        $allowed = [
            Ticket::STATUS_WAITING => [Ticket::STATUS_CALLING, Ticket::STATUS_CANCELLED],
            Ticket::STATUS_CALLING => [Ticket::STATUS_SERVING, Ticket::STATUS_NO_SHOW, Ticket::STATUS_CANCELLED],
            Ticket::STATUS_SERVING => [Ticket::STATUS_SERVED, Ticket::STATUS_CANCELLED],
            Ticket::STATUS_SERVED => [],
            Ticket::STATUS_NO_SHOW => [],
            Ticket::STATUS_CANCELLED => [],
        ];

        return in_array($to, $allowed[$from] ?? [], true);
    }
}
