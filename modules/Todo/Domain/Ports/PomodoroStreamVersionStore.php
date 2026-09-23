<?php

namespace Modules\Todo\Domain\Ports;

interface PomodoroStreamVersionStore
{
    public function current(int $userId): int;

    public function bump(int $userId): int;
}
