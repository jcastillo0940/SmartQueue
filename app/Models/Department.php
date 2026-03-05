<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
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
