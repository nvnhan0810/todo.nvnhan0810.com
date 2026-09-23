<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\PromoteBacklogItems;
use Modules\Todo\Domain\Ports\TodoRepository;

final class PromoteBacklogItemsHandler implements CommandHandler
{
    public function __construct(private readonly TodoRepository $todos) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof PromoteBacklogItems);

        return $this->todos->promoteBacklogItems($command->items, $command->actorUserId);
    }
}
