<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\SubscribeWebPush;
use Modules\Todo\Domain\Ports\WebPushSubscriptionRepository;
use Modules\Todo\Domain\WebPushSubscription;

final class SubscribeWebPushHandler implements CommandHandler
{
    public function __construct(
        private readonly WebPushSubscriptionRepository $repository,
    ) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof SubscribeWebPush);

        $this->repository->upsert(new WebPushSubscription(
            userId: $command->userId,
            endpoint: $command->endpoint,
            publicKey: $command->publicKey,
            authToken: $command->authToken,
            contentEncoding: $command->contentEncoding !== '' ? $command->contentEncoding : 'aesgcm',
            userAgent: $command->userAgent,
            lastFocusedAt: null,
        ));

        return null;
    }
}
