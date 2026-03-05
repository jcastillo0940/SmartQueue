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
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre de la cadena, ej: "Supermercados El Rey"
            $table->string('whatsapp_phone_id')->nullable(); // Para Meta API
            $table->text('meta_access_token')->nullable(); // Token de Meta API
            $table->boolean('is_active')->default(true); // Para suspender cuentas por falta de pago
            $table->timestamps();
        });
    }

   /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
