<?php

namespace Modules\Todo\Domain\Ports;

interface MatrixStreamVersionStore
{
    public function current(): int;

    public function bump(): void;
}
