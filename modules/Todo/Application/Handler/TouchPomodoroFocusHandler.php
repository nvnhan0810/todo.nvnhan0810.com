<?php

namespace Modules\Todo\Application\Handler;

use DateTimeImmutable;
use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\TouchPomodoroFocus;
use Modules\Todo\Domain\PomodoroState;
use Modules\Todo\Domain\Ports\PomodoroStateRepository;

final class TouchPomodoroFocusHandler implements CommandHandler
{
    public function __construct(
        private readonly PomodoroStateRepository $repository,
    ) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof TouchPomodoroFocus);

        if (! $command->focused || $command->sessionUuid === '') {
            return null;
        }

        $existing = $this->repository->findByUserId($command->userId);
        if ($existing === null) {
            return null;
        }

        if (
            ! $existing->isRunning
            || $existing->sessionUuid === null
            || $existing->sessionUuid !== $command->sessionUuid
        ) {
            return null;
        }

        $next = new PomodoroState(
            userId: $existing->userId,
            focusMinutes: $existing->focusMinutes,
            shortBreakMinutes: $existing->shortBreakMinutes,
            sessionsBeforeLongBreak: $existing->sessionsBeforeLongBreak,
            longBreakMinutes: $existing->longBreakMinutes,
            phase: $existing->phase,
            remainingMs: $existing->remainingMs,
            endsAt: $existing->endsAt,
            focusCount: $existing->focusCount,
            activeTodoId: $existing->activeTodoId,
            isRunning: $existing->isRunning,
            clientUpdatedAt: $existing->clientUpdatedAt,
            sessionUuid: $existing->sessionUuid,
            lastFocusedAt: new DateTimeImmutable('now'),
        );

        $this->repository->save($next);

        return null;
    }
}
