<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = ['tenant_id', 'name', 'location', 'timezone', 'is_active'];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
