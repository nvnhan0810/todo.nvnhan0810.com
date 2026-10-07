<?php

namespace Modules\Todo\Domain\Ports;

use Modules\Todo\Domain\WebPushSubscription;

interface WebPushSubscriptionRepository
{
    public function upsert(WebPushSubscription $subscription): void;

    public function deleteByEndpoint(int $userId, string $endpoint): void;

    public function markFocused(int $userId, string $endpoint, bool $focused): void;

    /**
     * Active subscriptions only (disabled ones are excluded from delivery).
     *
     * @return list<WebPushSubscription>
     */
    public function listByUserId(int $userId): array;

    public function deleteByEndpointOnly(string $endpoint): void;

    public function recordSendSuccess(string $endpoint): void;

    public function recordSendFailure(string $endpoint, string $reason): void;
}
