<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class CompleteMatrixTodo implements Command
{
    public function __construct(
        public readonly int $userId,
        public readonly int $todoId,
    ) {}
}
