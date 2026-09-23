<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Query;
use Modules\Shared\Application\QueryHandler;
use Modules\Todo\Application\Query\GetPomodoroState;
use Modules\Todo\Application\Service\ReconcileOverduePomodoro;
use Modules\Todo\Domain\PomodoroState;
use Modules\Todo\Domain\Ports\PomodoroStateRepository;
use Modules\Todo\Domain\Ports\PomodoroStreamVersionStore;

final class GetPomodoroStateHandler implements QueryHandler
{
    public function __construct(

        private readonly PomodoroStateRepository $repository,
        private readonly ReconcileOverduePomodoro $reconcileOverduePomodoro,
        private readonly PomodoroStreamVersionStore $pomodoroStreamVersion,
    ) {}

    public function handle(Query $query): mixed
    {
        assert($query instanceof GetPomodoroState);

        $this->reconcileOverduePomodoro->execute($query->userId);

        $state = $this->repository->findByUserId($query->userId) ?? PomodoroState::defaultFor($query->userId);

        return $state->toPayload($this->pomodoroStreamVersion->current($query->userId));
    }
}
