<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\UpdateProject;
use Modules\Todo\Domain\Ports\ProjectRepository;

final class UpdateProjectHandler implements CommandHandler
{
    public function __construct(private readonly ProjectRepository $projects) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof UpdateProject);

        return $this->projects->update($command->projectId, $command->data);
    }
}
