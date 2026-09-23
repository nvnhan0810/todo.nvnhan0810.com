<?php

namespace Modules\Todo\Domain\Ports;

use Modules\Todo\Domain\PomodoroDefaults;

interface PomodoroPhaseJobScheduler
{
    public function schedule(
        int $userId,
        ?string $sessionUuid,
        ?int $endsAtMs,
        bool $isRunning,
        string $fromPhase = PomodoroDefaults::PHASE_FOCUS,
        ?string $previousSessionUuid = null,
    ): void;

    public function cancel(?string $sessionUuid): void;
}
