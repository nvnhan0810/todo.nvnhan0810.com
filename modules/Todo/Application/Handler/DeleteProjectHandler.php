<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\DeleteProject;
use Modules\Todo\Domain\Ports\ProjectRepository;

final class DeleteProjectHandler implements CommandHandler
{
    public function __construct(private readonly ProjectRepository $projects) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof DeleteProject);
        $this->projects->delete($command->projectId);

        return null;
    }
}
