<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Query;
use Modules\Shared\Application\QueryBus;
use Modules\Shared\Application\QueryHandler;
use Modules\Todo\Application\Query\GetMatrixPageData;
use Modules\Todo\Application\Query\GetPomodoroState;
use Modules\Todo\Domain\Ports\MatrixStreamVersionStore;
use Modules\Todo\Domain\Ports\ProjectRepository;
use Modules\Todo\Domain\Ports\TodoRepository;
use Modules\Todo\Domain\TodoPriority;
use Modules\Todo\Domain\TodoStatus;

final class GetMatrixPageDataHandler implements QueryHandler
{
    public function __construct(
        private readonly TodoRepository $todos,
        private readonly ProjectRepository $projects,
        private readonly QueryBus $queries,
        private readonly MatrixStreamVersionStore $matrixStreamVersion,
    ) {}

    public function handle(Query $query): mixed
    {
        assert($query instanceof GetMatrixPageData);

        $userId = $query->userId;

        return [
            'quadrants' => $this->todos->listActiveByQuadrant($userId),
            'version' => $this->matrixStreamVersion->current($userId),
            'pomodoro' => $this->queries->ask(new GetPomodoroState($userId)),
            'projects' => $this->projects->listOptions($userId),
            'statuses' => TodoStatus::ALL,
            'priorities' => TodoPriority::ALL,
            'backlog' => $this->todos->listBacklog($userId),
        ];
    }
}
