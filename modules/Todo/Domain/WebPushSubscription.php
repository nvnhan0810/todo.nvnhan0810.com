<?php

namespace Modules\Todo\Domain;

final class WebPushSubscription
{
    public const MAX_CONSECUTIVE_FAILURES = 5;

    public function __construct(
        public readonly int $userId,
        public readonly string $endpoint,
        public readonly string $publicKey,
        public readonly string $authToken,
        public readonly string $contentEncoding,
        public readonly ?string $userAgent,
        public readonly ?\DateTimeInterface $lastFocusedAt,
        public readonly bool $isActive = true,
        public readonly int $failedSent = 0,
        public readonly ?string $lastFailedReason = null,
    ) {}
}
