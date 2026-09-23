<?php

namespace Modules\Todo\Presentation\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Modules\Shared\Application\CommandBus;
use Modules\Todo\Application\Command\DeliverPomodoroPhasePush;
use Modules\Todo\Domain\PomodoroDefaults;

final class SendPomodoroPhasePushJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    public int $userId = 0;

    public string $sessionUuid = '';

    public int $expectedEndsAtMs = 0;

    public string $fromPhase = PomodoroDefaults::PHASE_FOCUS;

    public function __construct(
        int $userId,
        string $sessionUuid,
        int $expectedEndsAtMs,
        string $fromPhase = PomodoroDefaults::PHASE_FOCUS,
    ) {
        $this->userId = $userId;
        $this->sessionUuid = $sessionUuid;
        $this->expectedEndsAtMs = $expectedEndsAtMs;
        $this->fromPhase = in_array($fromPhase, PomodoroDefaults::PHASES, true)
            ? $fromPhase
            : PomodoroDefaults::PHASE_FOCUS;
    }

    public function handle(CommandBus $commands): void
    {
        if ($this->userId <= 0 || $this->sessionUuid === '' || $this->expectedEndsAtMs <= 0) {
            return;
        }

        $commands->dispatch(new DeliverPomodoroPhasePush(
            $this->userId,
            $this->sessionUuid,
            $this->expectedEndsAtMs,
            $this->fromPhase,
        ));
    }
}
