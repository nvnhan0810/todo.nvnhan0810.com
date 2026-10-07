<?php

namespace Modules\Todo\Infrastructure;

use App\Models\WebPushSubscription as WebPushSubscriptionModel;
use DateTimeInterface;
use Modules\Todo\Domain\Ports\WebPushSubscriptionRepository;
use Modules\Todo\Domain\WebPushSubscription;

final class EloquentWebPushSubscriptionRepository implements WebPushSubscriptionRepository
{
    public function upsert(WebPushSubscription $subscription): void
    {
        WebPushSubscriptionModel::query()->updateOrCreate(
            [
                'user_id' => $subscription->userId,
                'endpoint_hash' => hash('sha256', $subscription->endpoint),
            ],
            [
                'endpoint' => $subscription->endpoint,
                'public_key' => $subscription->publicKey,
                'auth_token' => $subscription->authToken,
                'content_encoding' => $subscription->contentEncoding,
                'user_agent' => $subscription->userAgent,
                'last_focused_at' => $subscription->lastFocusedAt,
                'is_active' => true,
                'failed_sent' => 0,
                'last_failed_reason' => null,
            ],
        );
    }

    public function deleteByEndpoint(int $userId, string $endpoint): void
    {
        WebPushSubscriptionModel::query()
            ->where('user_id', $userId)
            ->where('endpoint_hash', hash('sha256', $endpoint))
            ->delete();
    }

    public function deleteByEndpointOnly(string $endpoint): void
    {
        WebPushSubscriptionModel::query()
            ->where('endpoint_hash', hash('sha256', $endpoint))
            ->delete();
    }

    public function markFocused(int $userId, string $endpoint, bool $focused): void
    {
        $query = WebPushSubscriptionModel::query()
            ->where('user_id', $userId)
            ->where('endpoint_hash', hash('sha256', $endpoint));

        if ($focused) {
            $query->update(['last_focused_at' => now()]);
        } else {
            $query->update(['last_focused_at' => null]);
        }
    }

    public function listByUserId(int $userId): array
    {
        return WebPushSubscriptionModel::query()
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->get()
            ->map(fn (WebPushSubscriptionModel $row): WebPushSubscription => $this->toDomain($row))
            ->all();
    }

    public function recordSendSuccess(string $endpoint): void
    {
        WebPushSubscriptionModel::query()
            ->where('endpoint_hash', hash('sha256', $endpoint))
            ->update([
                'failed_sent' => 0,
                'last_failed_reason' => null,
            ]);
    }

    public function recordSendFailure(string $endpoint, string $reason): void
    {
        $endpointHash = hash('sha256', $endpoint);

        $affected = WebPushSubscriptionModel::query()
            ->where('endpoint_hash', $endpointHash)
            ->increment('failed_sent');

        if ($affected === 0) {
            return;
        }

        WebPushSubscriptionModel::query()
            ->where('endpoint_hash', $endpointHash)
            ->update(['last_failed_reason' => $reason]);

        WebPushSubscriptionModel::query()
            ->where('endpoint_hash', $endpointHash)
            ->where('failed_sent', '>=', WebPushSubscription::MAX_CONSECUTIVE_FAILURES)
            ->update(['is_active' => false]);
    }

    private function toDomain(WebPushSubscriptionModel $row): WebPushSubscription
    {
        /** @var DateTimeInterface|null $focused */
        $focused = $row->last_focused_at;

        return new WebPushSubscription(
            userId: (int) $row->user_id,
            endpoint: (string) $row->endpoint,
            publicKey: (string) $row->public_key,
            authToken: (string) $row->auth_token,
            contentEncoding: (string) $row->content_encoding,
            userAgent: $row->user_agent !== null ? (string) $row->user_agent : null,
            lastFocusedAt: $focused,
            isActive: (bool) $row->is_active,
            failedSent: (int) $row->failed_sent,
            lastFailedReason: $row->last_failed_reason !== null ? (string) $row->last_failed_reason : null,
        );
    }
}
