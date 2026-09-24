<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Query;
use Modules\Shared\Application\QueryHandler;
use Modules\Todo\Application\Query\GetTodoFormData;
use Modules\Todo\Domain\Ports\ProjectRepository;
use Modules\Todo\Domain\Ports\TodoRepository;
use Modules\Todo\Domain\TodoPriority;
use Modules\Todo\Domain\TodoStatus;

final class GetTodoFormDataHandler implements QueryHandler
{
    public function __construct(
        private readonly TodoRepository $todos,
        private readonly ProjectRepository $projects,
    ) {}

    public function handle(Query $query): mixed
    {
        assert($query instanceof GetTodoFormData);

        $todo = $query->todoId !== null
            ? $this->todos->findById($query->userId, $query->todoId)
            : null;

        return [
            'todo' => $todo,
            'projects' => $this->projects->listOptions($query->userId),
            'statuses' => TodoStatus::ALL,
            'priorities' => TodoPriority::ALL,
            'default_project_id' => $query->defaultProjectId,
        ];
    }
}
