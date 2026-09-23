<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Query;
use Modules\Shared\Application\QueryHandler;
use Modules\Todo\Application\Query\GetWebPushStatus;
use Modules\Todo\Domain\Ports\WebPushSubscriptionRepository;

final class GetWebPushStatusHandler implements QueryHandler
{
    public function __construct(private readonly WebPushSubscriptionRepository $repository) {}

    public function handle(Query $query): mixed
    {
        assert($query instanceof GetWebPushStatus);

        return [
            'configured' => filled(config('web-push.vapid.public_key'))
                && filled(config('web-push.vapid.private_key')),
            'subscriptionCount' => count($this->repository->listByUserId($query->userId)),
        ];
    }
}
