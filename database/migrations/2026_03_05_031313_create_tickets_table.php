<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->string('number'); // Ej: "C-14"
            $table->string('source')->default('KIOSK'); // KIOSK, WEB o WHATSAPP
            $table->string('customer_phone')->nullable(); // Si viene de WhatsApp
            $table->string('status')->default('WAITING'); // WAITING, CALLING, SERVING, SERVED, NO_SHOW
            $table->foreignId('called_by')->nullable()->constrained('staff')->nullOnDelete(); // El carnicero que lo llamó
            $table->integer('call_count')->default(0); // Para saber cuántas veces se le llamó en pantalla
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
