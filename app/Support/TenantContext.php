<?php

namespace App\Support;

final class TenantContext
{
    private static ?int $tenantId = null;

    public static function setTenantId(?int $tenantId): void
    {
        self::$tenantId = $tenantId;
    }

    public static function tenantId(): ?int
    {
        return self::$tenantId;
    }
}
