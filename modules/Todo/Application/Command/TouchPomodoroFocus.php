<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class TouchPomodoroFocus implements Command
{
    public function __construct(
        public readonly int $userId,
        public readonly string $sessionUuid,
        public readonly bool $focused,
    ) {}
}
