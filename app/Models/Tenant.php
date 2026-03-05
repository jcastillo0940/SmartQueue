<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $fillable = [
        'name',
        'whatsapp_phone_id',
        'meta_access_token',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
