<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\UpdateWebPushPresence;
use Modules\Todo\Domain\Ports\WebPushSubscriptionRepository;

final class UpdateWebPushPresenceHandler implements CommandHandler
{
    public function __construct(
        private readonly WebPushSubscriptionRepository $repository,
    ) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof UpdateWebPushPresence);

        $this->repository->markFocused($command->userId, $command->endpoint, $command->focused);

        return null;
    }
}
