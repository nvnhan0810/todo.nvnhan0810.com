<?php

namespace Modules\Todo\Infrastructure;

use Illuminate\Support\Facades\Cache;
use Modules\Todo\Domain\Ports\MatrixStreamVersionStore;

final class CacheMatrixStreamVersionStore implements MatrixStreamVersionStore
{
    public const CACHE_KEY_PREFIX = 'todo.matrix.version.';

    public function current(int $userId): int
    {
        return (int) Cache::get($this->cacheKey($userId), 0);
    }

    public function bump(int $userId): void
    {
        $next = $this->current($userId) + 1;
        Cache::forever($this->cacheKey($userId), $next);
    }

    private function cacheKey(int $userId): string
    {
        return self::CACHE_KEY_PREFIX.$userId;
    }
}
