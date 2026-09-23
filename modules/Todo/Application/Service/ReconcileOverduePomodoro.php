<?php

namespace Modules\Todo\Application\Service;

use Modules\Shared\Application\CommandBus;
use Modules\Todo\Application\Command\DeliverPomodoroPhasePush;
use Modules\Todo\Domain\PomodoroState;
use Modules\Todo\Domain\Ports\PomodoroStateRepository;

final class ReconcileOverduePomodoro
{
    public function __construct(
        private readonly PomodoroStateRepository $repository,
        private readonly CommandBus $commands,
    ) {}

    public function execute(int $userId): void
    {
        $state = $this->repository->findByUserId($userId);
        if ($state === null) {
            return;
        }

        $guard = 0;
        while ($guard < 8) {
            $guard++;
            $state = $this->repository->findByUserId($userId);
            if (
                $state === null
                || ! $state->isRunning
                || $state->endsAt === null
                || $state->sessionUuid === null
            ) {
                return;
            }

            $nowMs = PomodoroState::nowMs();
            if ($state->endsAt > $nowMs + 1500) {
                return;
            }

            $this->commands->dispatch(new DeliverPomodoroPhasePush(
                $userId,
                $state->sessionUuid,
                (int) $state->endsAt,
                $state->phase,
            ));
        }

    }
}
