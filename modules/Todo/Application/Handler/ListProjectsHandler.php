<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Query;
use Modules\Shared\Application\QueryHandler;
use Modules\Todo\Application\Query\ListProjects;
use Modules\Todo\Domain\Ports\ProjectRepository;

final class ListProjectsHandler implements QueryHandler
{
    public function __construct(private readonly ProjectRepository $projects) {}

    public function handle(Query $query): mixed
    {
        assert($query instanceof ListProjects);

        return ['projects' => $this->projects->listAll($query->userId)];
    }
}
