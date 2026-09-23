<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\ResetPomodoro;
use Modules\Todo\Domain\PomodoroDefaults;
use Modules\Todo\Domain\PomodoroState;
use Modules\Todo\Domain\Ports\PomodoroPhaseJobScheduler;
use Modules\Todo\Domain\Ports\PomodoroStateRepository;
use Modules\Todo\Domain\Ports\PomodoroStreamVersionStore;

final class ResetPomodoroHandler implements CommandHandler
{
    public function __construct(

        private readonly PomodoroStateRepository $repository,
        private readonly PomodoroPhaseJobScheduler $scheduler,
        private readonly PomodoroStreamVersionStore $pomodoroStreamVersion,
    ) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof ResetPomodoro);

        $userId = $command->userId;
        $existing = $this->repository->findByUserId($userId) ?? PomodoroState::defaultFor($userId);
        if ($existing->sessionUuid !== null) {
            $this->scheduler->cancel($existing->sessionUuid);
        }

        $nowMs = PomodoroState::nowMs();
        $next = new PomodoroState(
            userId: $existing->userId,
            focusMinutes: $existing->focusMinutes,
            shortBreakMinutes: $existing->shortBreakMinutes,
            sessionsBeforeLongBreak: $existing->sessionsBeforeLongBreak,
            longBreakMinutes: $existing->longBreakMinutes,
            phase: PomodoroDefaults::PHASE_FOCUS,
            remainingMs: $existing->focusMinutes * 60_000,
            endsAt: null,
            focusCount: 0,
            activeTodoId: null,
            isRunning: false,
            clientUpdatedAt: $nowMs,
            sessionUuid: null,
            lastFocusedAt: $existing->lastFocusedAt,
        );

        $saved = $this->repository->save($next);
        $this->pomodoroStreamVersion->bump($userId);

        return $saved->toPayload($this->pomodoroStreamVersion->current($userId));
    }
}
