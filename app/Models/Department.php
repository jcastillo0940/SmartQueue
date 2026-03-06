<?php
namespace App\Models;

use App\Models\Concerns\HasTenant; // 1. Importar el trait
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasTenant; // 2. Usar el trait

    protected $fillable = [
        'tenant_id', // 3. Añadir tenant_id
        'branch_id',
        'name',
        'prefix',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function staff()
    {
        return $this->hasMany(Staff::class);
    }
}
