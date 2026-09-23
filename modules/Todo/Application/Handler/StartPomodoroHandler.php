<?php

namespace Modules\Todo\Application\Handler;

use Illuminate\Support\Str;
use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\StartPomodoro;
use Modules\Todo\Domain\PomodoroState;
use Modules\Todo\Domain\Ports\PomodoroPhaseJobScheduler;
use Modules\Todo\Domain\Ports\PomodoroStateRepository;
use Modules\Todo\Domain\Ports\PomodoroStreamVersionStore;

final class StartPomodoroHandler implements CommandHandler
{
    public function __construct(

        private readonly PomodoroStateRepository $repository,
        private readonly PomodoroPhaseJobScheduler $scheduler,
        private readonly PomodoroStreamVersionStore $pomodoroStreamVersion,
    ) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof StartPomodoro);

        $userId = $command->userId;
        $activeTodoId = $command->activeTodoId;
        $existing = $this->repository->findByUserId($userId) ?? PomodoroState::defaultFor($userId);
        $nowMs = PomodoroState::nowMs();

        $remainingMs = $existing->isRunning && $existing->endsAt !== null
            ? max(0, $existing->endsAt - $nowMs)
            : max(0, $existing->remainingMs);

        if ($remainingMs <= 0) {
            return $existing->toPayload($this->pomodoroStreamVersion->current($userId));
        }

        if ($existing->isRunning && $existing->sessionUuid !== null && $existing->endsAt !== null) {
            if ($activeTodoId !== null && $activeTodoId !== $existing->activeTodoId) {
                $updated = new PomodoroState(
                    userId: $existing->userId,
                    focusMinutes: $existing->focusMinutes,
                    shortBreakMinutes: $existing->shortBreakMinutes,
                    sessionsBeforeLongBreak: $existing->sessionsBeforeLongBreak,
                    longBreakMinutes: $existing->longBreakMinutes,
                    phase: $existing->phase,
                    remainingMs: $remainingMs,
                    endsAt: $existing->endsAt,
                    focusCount: $existing->focusCount,
                    activeTodoId: $activeTodoId,
                    isRunning: true,
                    clientUpdatedAt: $nowMs,
                    sessionUuid: $existing->sessionUuid,
                    lastFocusedAt: $existing->lastFocusedAt,
                );
                $saved = $this->repository->save($updated);
                $this->pomodoroStreamVersion->bump($userId);

                return $saved->toPayload($this->pomodoroStreamVersion->current($userId));
            }

            return $existing->toPayload($this->pomodoroStreamVersion->current($userId));
        }

        $previousUuid = $existing->sessionUuid;
        if ($previousUuid !== null) {
            $this->scheduler->cancel($previousUuid);
        }

        $sessionUuid = (string) Str::uuid();
        $endsAt = $nowMs + $remainingMs;
        $next = new PomodoroState(
            userId: $existing->userId,
            focusMinutes: $existing->focusMinutes,
            shortBreakMinutes: $existing->shortBreakMinutes,
            sessionsBeforeLongBreak: $existing->sessionsBeforeLongBreak,
            longBreakMinutes: $existing->longBreakMinutes,
            phase: $existing->phase,
            remainingMs: $remainingMs,
            endsAt: $endsAt,
            focusCount: $existing->focusCount,
            activeTodoId: $activeTodoId ?? $existing->activeTodoId,
            isRunning: true,
            clientUpdatedAt: $nowMs,
            sessionUuid: $sessionUuid,
            lastFocusedAt: $existing->lastFocusedAt,
        );

        $saved = $this->repository->save($next);
        $this->pomodoroStreamVersion->bump($userId);

        $this->scheduler->schedule(
            $userId,
            $sessionUuid,
            $endsAt,
            true,
            $saved->phase,
            $previousUuid,
        );

        return $saved->toPayload($this->pomodoroStreamVersion->current($userId));
    }
}
