<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class UnsubscribeWebPush implements Command
{
    public function __construct(
        public readonly int $userId,
        public readonly string $endpoint,
    ) {}
}
