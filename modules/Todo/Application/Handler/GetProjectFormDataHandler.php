<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Query;
use Modules\Shared\Application\QueryHandler;
use Modules\Todo\Application\Query\GetProjectFormData;
use Modules\Todo\Domain\Ports\ProjectRepository;

final class GetProjectFormDataHandler implements QueryHandler
{
    public function __construct(private readonly ProjectRepository $projects) {}

    public function handle(Query $query): mixed
    {
        assert($query instanceof GetProjectFormData);

        $project = $query->projectId !== null
            ? $this->projects->findById($query->userId, $query->projectId)
            : null;

        return ['project' => $project];
    }
}
