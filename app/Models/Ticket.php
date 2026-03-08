<?php

namespace App\Models;

use App\Models\Concerns\HasTenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Ticket extends Model
{
    use HasTenant;

    public const STATUS_WAITING = 'WAITING';
    public const STATUS_CALLING = 'CALLING';
    public const STATUS_SERVING = 'SERVING';
    public const STATUS_SERVED = 'SERVED';
    public const STATUS_NO_SHOW = 'NO_SHOW';
    public const STATUS_CANCELLED = 'CANCELLED';

    protected $fillable = [
        'tenant_id',
        'branch_id',
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

    // Generar UUID automáticamente al crear
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function calledBy()
    {
        return $this->belongsTo(Staff::class, 'called_by');
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
