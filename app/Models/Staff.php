<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    protected $fillable = [
        'department_id',
        'name',
        'qr_hash',
        'status',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
