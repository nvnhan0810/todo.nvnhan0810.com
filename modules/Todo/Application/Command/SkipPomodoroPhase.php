<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class SkipPomodoroPhase implements Command
{
    public function __construct(public readonly int $userId) {}
}
