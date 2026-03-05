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
        Schema::table('tickets', function (Blueprint $table) {
            $table->foreignId('assigned_staff_id')
                ->nullable()
                ->after('called_by')
                ->constrained('staff')
                ->nullOnDelete();

            $table->unsignedInteger('priority')->default(0)->after('call_count');

            $table->timestamp('called_at')->nullable()->after('priority');
            $table->timestamp('serving_started_at')->nullable()->after('called_at');
            $table->timestamp('served_at')->nullable()->after('serving_started_at');
            $table->timestamp('no_show_at')->nullable()->after('served_at');
            $table->timestamp('cancelled_at')->nullable()->after('no_show_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropConstrainedForeignId('assigned_staff_id');
            $table->dropColumn([
                'priority',
                'called_at',
                'serving_started_at',
                'served_at',
                'no_show_at',
                'cancelled_at',
            ]);
        });
    }
};
