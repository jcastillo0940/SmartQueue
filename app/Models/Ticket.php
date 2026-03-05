<?php

namespace App\Models;

use App\Models\Concerns\HasTenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    use HasTenant;

    public const STATUS_WAITING = 'waiting';
    public const STATUS_CALLING = 'calling';
    public const STATUS_SERVING = 'serving';
    public const STATUS_SERVED = 'served';
    public const STATUS_NO_SHOW = 'no_show';
    public const STATUS_CANCELLED = 'cancelled';

    public const SOURCE_WEB = 'web';
    public const SOURCE_WHATSAPP = 'whatsapp';
    public const SOURCE_KIOSK = 'kiosk';

    protected $fillable = [
        'uuid',
        'tenant_id',
        'branch_id',
        'department_id',
        'staff_id',
        'number',
        'status',
        'source',
        'call_count',
        'called_at',
        'serving_started_at',
        'served_at',
        'cancelled_at',
    ];

    protected $casts = [
        'call_count' => 'integer',
        'called_at' => 'datetime',
        'serving_started_at' => 'datetime',
        'served_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
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
