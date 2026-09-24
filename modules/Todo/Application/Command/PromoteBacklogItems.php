<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class PromoteBacklogItems implements Command
{
    /**
     * @param  list<array{id: int, is_urgent: bool, is_important: bool}>  $items
     */
    public function __construct(
        public readonly int $userId,
        public readonly array $items,
        public readonly ?int $actorUserId,
    ) {}
}
