<?php

namespace App\Models;

use App\Models\Concerns\HasTenant; // 1. Importar el trait
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    use HasTenant; // 2. Usar el trait

    public const STATUS_WAITING = 'WAITING';
    public const STATUS_CALLING = 'CALLING';
    public const STATUS_SERVING = 'SERVING';
    public const STATUS_SERVED = 'SERVED';
    public const STATUS_NO_SHOW = 'NO_SHOW';
    public const STATUS_CANCELLED = 'CANCELLED';

    protected $fillable = [
        'tenant_id', // 3. Añadir tenant_id
        'department_id',
        'branch_id', // También es buena práctica tenerlo aquí si está en la migración
        'number',
        'source',
        'customer_phone',
        'status',
        'called_by',
        'assigned_staff_id',
        'call_count',
        'priority',
        'called_at',
        'serving_started_at',
        'served_at',
        'no_show_at',
        'cancelled_at',
    ];
    
    // ... el resto de tus casts y métodos se mantienen igual ...
