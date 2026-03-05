<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Staff;
use App\Models\Tenant;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_call_next_marks_first_waiting_ticket_as_calling(): void
    {
        $user = User::factory()->create();
        $department = $this->makeDepartmentTree();
        $staff = Staff::query()->create([
            'department_id' => $department->id,
            'name' => 'Operador 1',
            'qr_hash' => 'qr-operador-1',
            'status' => 'active',
        ]);

        Ticket::query()->create([
            'department_id' => $department->id,
            'number' => 'C-01',
            'source' => 'WEB',
            'status' => Ticket::STATUS_WAITING,
            'call_count' => 0,
            'priority' => 0,
        ]);

        $prioritized = Ticket::query()->create([
            'department_id' => $department->id,
            'number' => 'C-99',
            'source' => 'WEB',
            'status' => Ticket::STATUS_WAITING,
            'call_count' => 0,
            'priority' => 1,
        ]);

        $this->actingAs($user)
            ->post(route('tickets.call-next'), [
                'department_id' => $department->id,
                'staff_id' => $staff->id,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('tickets', [
            'id' => $prioritized->id,
            'status' => Ticket::STATUS_CALLING,
            'call_count' => 1,
            'assigned_staff_id' => $staff->id,
        ]);
    }

    public function test_recall_reaches_max_calls_and_sets_no_show(): void
    {
        config()->set('smartqueue.tickets.max_calls_before_no_show', 3);

        $user = User::factory()->create();
        $department = $this->makeDepartmentTree();

        $ticket = Ticket::query()->create([
            'department_id' => $department->id,
            'number' => 'C-13',
            'source' => 'WEB',
            'status' => Ticket::STATUS_CALLING,
            'call_count' => 2,
            'priority' => 0,
        ]);

        $this->actingAs($user)
            ->post(route('tickets.recall', $ticket->id), [])
            ->assertRedirect();

        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'status' => Ticket::STATUS_NO_SHOW,
            'call_count' => 3,
        ]);
    }

    private function makeDepartmentTree(): Department
    {
        $tenant = Tenant::query()->create([
            'name' => 'Tenant Demo',
            'is_active' => true,
        ]);

        $branch = Branch::query()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Sucursal 1',
            'location' => 'Centro',
            'timezone' => 'America/Panama',
            'is_active' => true,
        ]);

        return Department::query()->create([
            'branch_id' => $branch->id,
            'name' => 'Carnicería',
            'prefix' => 'C',
            'is_active' => true,
        ]);
    }
}
