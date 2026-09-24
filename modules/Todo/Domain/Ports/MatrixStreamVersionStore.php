<?php

namespace Modules\Todo\Domain\Ports;

interface MatrixStreamVersionStore
{
    public function current(int $userId): int;

    public function bump(int $userId): void;
}
