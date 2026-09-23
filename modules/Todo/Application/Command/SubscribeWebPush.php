<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class SubscribeWebPush implements Command
{
    public function __construct(
        public readonly int $userId,
        public readonly string $endpoint,
        public readonly string $publicKey,
        public readonly string $authToken,
        public readonly string $contentEncoding = 'aes128gcm',
        public readonly ?string $userAgent = null,
    ) {}
}
