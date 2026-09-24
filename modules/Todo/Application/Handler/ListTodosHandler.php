<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Query;
use Modules\Shared\Application\QueryHandler;
use Modules\Todo\Application\Query\ListTodos;
use Modules\Todo\Domain\Ports\ProjectRepository;
use Modules\Todo\Domain\Ports\TodoRepository;
use Modules\Todo\Domain\TodoPriority;
use Modules\Todo\Domain\TodoStatus;

final class ListTodosHandler implements QueryHandler
{
    public function __construct(
        private readonly TodoRepository $todos,
        private readonly ProjectRepository $projects,
    ) {}

    public function handle(Query $query): mixed
    {
        assert($query instanceof ListTodos);

        return [
            'todos' => $this->todos->paginate($query->userId, [
                'project_id' => $query->projectId,
                'status' => $query->status,
                'search' => $query->search,
            ], $query->perPage),
            'projects' => $this->projects->listOptions($query->userId),
            'filters' => [
                'project_id' => $query->projectId,
                'status' => $query->status,
                'search' => $query->search,
            ],
            'statuses' => TodoStatus::ALL,
            'priorities' => TodoPriority::ALL,
        ];
    }
}
