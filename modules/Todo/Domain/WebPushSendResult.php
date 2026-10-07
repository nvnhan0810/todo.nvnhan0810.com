<?php

namespace Modules\Todo\Domain;

final class WebPushSendResult
{
    private function __construct(
        public readonly bool $ok,
        public readonly ?string $failureReason = null,
    ) {}

    public static function success(): self
    {
        return new self(ok: true);
    }

    public static function failure(string $reason): self
    {
        return new self(ok: false, failureReason: $reason);
    }
}
