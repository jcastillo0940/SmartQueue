<?php

namespace App\Models;

use App\Models\Concerns\HasTenant; // 1. Importar el trait
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Staff extends Model
{
    use HasTenant; // 2. Usar el trait

    protected $fillable = [
        'tenant_id', // 3. Añadir tenant_id
        'department_id',
        'name',
        'qr_hash',
        'status',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}
