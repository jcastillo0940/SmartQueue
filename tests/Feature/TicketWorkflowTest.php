<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Tenant;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_ticket_creates_ticket_for_authenticated_tenant(): void
    {
        $tenant = Tenant::query()->create(['name' => 'Tenant A']);
        $branch = Branch::query()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Sucursal A',
            'timezone' => 'America/Panama',
            'is_active' => true,
        ]);
        $department = Department::query()->create([
            'tenant_id' => $tenant->id,
            'branch_id' => $branch->id,
            'name' => 'Carnicería',
            'prefix' => 'C',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
        ]);

        $this->actingAs($user)
            ->post(route('tickets.store'), [
                'branch_id' => $branch->id,
                'department_id' => $department->id,
                'number' => 'C-01',
                'status' => Ticket::STATUS_WAITING,
                'source' => Ticket::SOURCE_WEB,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('tickets', [
            'tenant_id' => $tenant->id,
            'number' => 'C-01',
            'status' => Ticket::STATUS_WAITING,
            'source' => Ticket::SOURCE_WEB,
        ]);
    }
}
