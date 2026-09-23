<?php

namespace Modules\Todo\Infrastructure;

use Illuminate\Support\Facades\Cache;
use Modules\Todo\Domain\Ports\MatrixStreamVersionStore;

final class CacheMatrixStreamVersionStore implements MatrixStreamVersionStore
{
    public const CACHE_KEY = 'todo.matrix.version';

    public function current(): int
    {
        return (int) Cache::get(self::CACHE_KEY, 0);
    }

    public function bump(): void
    {
        $next = $this->current() + 1;
        Cache::forever(self::CACHE_KEY, $next);
    }
}
