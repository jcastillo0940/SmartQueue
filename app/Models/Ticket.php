<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    public const STATUS_WAITING = 'WAITING';
    public const STATUS_CALLING = 'CALLING';
    public const STATUS_SERVING = 'SERVING';
    public const STATUS_SERVED = 'SERVED';
    public const STATUS_NO_SHOW = 'NO_SHOW';
    public const STATUS_CANCELLED = 'CANCELLED';

    protected $fillable = [
        'department_id',
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

    protected $casts = [
        'called_at' => 'datetime',
        'serving_started_at' => 'datetime',
        'served_at' => 'datetime',
        'no_show_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'priority' => 'integer',
        'call_count' => 'integer',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function calledBy()
    {
        return $this->belongsTo(Staff::class, 'called_by');
    }

    public function assignedStaff()
    {
        return $this->belongsTo(Staff::class, 'assigned_staff_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', [
            self::STATUS_WAITING,
            self::STATUS_CALLING,
            self::STATUS_SERVING,
        ]);
    }
}
