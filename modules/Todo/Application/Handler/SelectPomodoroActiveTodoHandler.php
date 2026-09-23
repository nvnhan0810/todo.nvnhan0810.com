<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\SelectPomodoroActiveTodo;
use Modules\Todo\Domain\PomodoroState;
use Modules\Todo\Domain\Ports\PomodoroStateRepository;
use Modules\Todo\Domain\Ports\PomodoroStreamVersionStore;

final class SelectPomodoroActiveTodoHandler implements CommandHandler
{
    public function __construct(

        private readonly PomodoroStateRepository $repository,
        private readonly PomodoroStreamVersionStore $pomodoroStreamVersion,
    ) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof SelectPomodoroActiveTodo);

        $userId = $command->userId;
        $existing = $this->repository->findByUserId($userId) ?? PomodoroState::defaultFor($userId);
        $nowMs = PomodoroState::nowMs();

        $remainingMs = $existing->isRunning && $existing->endsAt !== null
            ? max(0, $existing->endsAt - $nowMs)
            : max(0, $existing->remainingMs);

        $next = new PomodoroState(
            userId: $existing->userId,
            focusMinutes: $existing->focusMinutes,
            shortBreakMinutes: $existing->shortBreakMinutes,
            sessionsBeforeLongBreak: $existing->sessionsBeforeLongBreak,
            longBreakMinutes: $existing->longBreakMinutes,
            phase: $existing->phase,
            remainingMs: $remainingMs,
            endsAt: $existing->endsAt,
            focusCount: $existing->focusCount,
            activeTodoId: $command->activeTodoId,
            isRunning: $existing->isRunning,
            clientUpdatedAt: $nowMs,
            sessionUuid: $existing->sessionUuid,
            lastFocusedAt: $existing->lastFocusedAt,
        );

        $saved = $this->repository->save($next);
        $this->pomodoroStreamVersion->bump($userId);

        return $saved->toPayload($this->pomodoroStreamVersion->current($userId));
    }
}
