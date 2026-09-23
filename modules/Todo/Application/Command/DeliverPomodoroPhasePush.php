<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class DeliverPomodoroPhasePush implements Command
{
    public function __construct(
        public readonly int $userId,
        public readonly string $sessionUuid,
        public readonly int $expectedEndsAtMs,
        public readonly string $fromPhase,
    ) {}
}
