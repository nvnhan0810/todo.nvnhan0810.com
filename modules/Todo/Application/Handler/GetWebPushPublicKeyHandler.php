<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Query;
use Modules\Shared\Application\QueryHandler;
use Modules\Todo\Application\Query\GetWebPushPublicKey;
use Modules\Todo\Domain\Ports\WebPushSender;

final class GetWebPushPublicKeyHandler implements QueryHandler
{
    public function __construct(private readonly WebPushSender $sender) {}

    public function handle(Query $query): mixed
    {
        assert($query instanceof GetWebPushPublicKey);

        if (! $this->sender->isConfigured()) {
            return ['configured' => false, 'publicKey' => null, 'httpStatus' => 503];
        }

        return [
            'configured' => true,
            'publicKey' => (string) config('web-push.vapid.public_key'),
            'httpStatus' => 200,
        ];
    }
}
