<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class UpdatePomodoroSettings implements Command
{
    /**
     * @param  array{focusMinutes: int, shortBreakMinutes: int, sessionsBeforeLongBreak: int, longBreakMinutes: int}  $settings
     */
    public function __construct(
        public readonly int $userId,
        public readonly array $settings,
    ) {}
}
