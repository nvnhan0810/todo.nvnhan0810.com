<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\PausePomodoro;
use Modules\Todo\Domain\PomodoroState;
use Modules\Todo\Domain\Ports\PomodoroPhaseJobScheduler;
use Modules\Todo\Domain\Ports\PomodoroStateRepository;
use Modules\Todo\Domain\Ports\PomodoroStreamVersionStore;

final class PausePomodoroHandler implements CommandHandler
{
    public function __construct(

        private readonly PomodoroStateRepository $repository,
        private readonly PomodoroPhaseJobScheduler $scheduler,
        private readonly PomodoroStreamVersionStore $pomodoroStreamVersion,
    ) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof PausePomodoro);

        $userId = $command->userId;
        $existing = $this->repository->findByUserId($userId) ?? PomodoroState::defaultFor($userId);
        if (! $existing->isRunning) {
            return $existing->toPayload($this->pomodoroStreamVersion->current($userId));
        }

        $nowMs = PomodoroState::nowMs();
        $remainingMs = $existing->endsAt !== null
            ? max(0, $existing->endsAt - $nowMs)
            : max(0, $existing->remainingMs);

        $previousUuid = $existing->sessionUuid;
        if ($previousUuid !== null) {
            $this->scheduler->cancel($previousUuid);
        }

        $next = new PomodoroState(
            userId: $existing->userId,
            focusMinutes: $existing->focusMinutes,
            shortBreakMinutes: $existing->shortBreakMinutes,
            sessionsBeforeLongBreak: $existing->sessionsBeforeLongBreak,
            longBreakMinutes: $existing->longBreakMinutes,
            phase: $existing->phase,
            remainingMs: $remainingMs,
            endsAt: null,
            focusCount: $existing->focusCount,
            activeTodoId: $existing->activeTodoId,
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
