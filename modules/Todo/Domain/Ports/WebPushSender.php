<?php

namespace Modules\Todo\Domain\Ports;

use Modules\Todo\Domain\WebPushSendResult;
use Modules\Todo\Domain\WebPushSubscription;

interface WebPushSender
{
    /**
     * @param  array{title: string, body: string, url?: string, tag?: string, icon?: string, topic?: string}  $payload
     */
    public function send(WebPushSubscription $subscription, array $payload): WebPushSendResult;

    public function isConfigured(): bool;
}
