<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::query()->create([
            'name' => 'SmartQueue Demo Retail',
            'domain' => 'demo.smartqueue.local',
            'settings' => [
                'timezone' => 'America/Panama',
                'nps_enabled' => true,
            ],
            'is_active' => true,
        ]);

        User::factory()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Super Admin Demo',
            'email' => 'admin@smartqueue.local',
            'role' => 'super_admin',
        ]);

        $branches = [
            ['name' => 'Sucursal Centro', 'location' => 'Vía España'],
            ['name' => 'Sucursal Norte', 'location' => 'Tumba Muerto'],
        ];

        foreach ($branches as $branchData) {
            $branch = Branch::query()->create([
                'tenant_id' => $tenant->id,
                'name' => $branchData['name'],
                'location' => $branchData['location'],
                'timezone' => 'America/Panama',
                'is_active' => true,
            ]);

            foreach ([
                ['name' => 'Carnicería', 'prefix' => 'C'],
                ['name' => 'Deli', 'prefix' => 'D'],
                ['name' => 'Panadería', 'prefix' => 'P'],
            ] as $departmentData) {
                Department::query()->create([
                    'tenant_id' => $tenant->id,
                    'branch_id' => $branch->id,
                    'name' => $departmentData['name'],
                    'prefix' => $departmentData['prefix'],
                    'is_active' => true,
                ]);
            }
        }
    }
}
