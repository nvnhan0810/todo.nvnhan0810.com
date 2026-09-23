<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\UnsubscribeWebPush;
use Modules\Todo\Domain\Ports\WebPushSubscriptionRepository;

final class UnsubscribeWebPushHandler implements CommandHandler
{
    public function __construct(
        private readonly WebPushSubscriptionRepository $repository,
    ) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof UnsubscribeWebPush);

        $this->repository->deleteByEndpoint($command->userId, $command->endpoint);

        return null;
    }
}
