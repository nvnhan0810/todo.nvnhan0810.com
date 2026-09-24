<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class UpdateMatrixTodo implements Command
{
    public function __construct(
        public readonly int $userId,
        public readonly int $todoId,
        public readonly bool $isUrgent,
        public readonly bool $isImportant,
        public readonly ?string $status,
        public readonly ?int $actorUserId,
    ) {}
}
