<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\CreateProject;
use Modules\Todo\Domain\Ports\ProjectRepository;

final class CreateProjectHandler implements CommandHandler
{
    public function __construct(private readonly ProjectRepository $projects) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof CreateProject);

        return $this->projects->create($command->data);
    }
}
