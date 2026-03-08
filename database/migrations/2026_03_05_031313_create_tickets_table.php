<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table): void {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->foreignId('called_by')->nullable()->constrained('staff')->nullOnDelete();
            $table->foreignId('assigned_staff_id')->nullable()->constrained('staff')->nullOnDelete();
            $table->string('number', 20);
            $table->string('customer_phone', 20)->nullable();
            $table->enum('status', ['WAITING', 'CALLING', 'SERVING', 'SERVED', 'NO_SHOW', 'CANCELLED'])->default('WAITING');
            $table->enum('source', ['WEB', 'WHATSAPP', 'KIOSK'])->default('KIOSK');
            $table->unsignedInteger('call_count')->default(0);
            $table->unsignedInteger('priority')->default(0);
            $table->timestamp('called_at')->nullable();
            $table->timestamp('serving_started_at')->nullable();
            $table->timestamp('served_at')->nullable();
            $table->timestamp('no_show_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
