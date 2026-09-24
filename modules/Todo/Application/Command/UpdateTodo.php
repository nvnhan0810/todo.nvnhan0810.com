<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class UpdateTodo implements Command
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function __construct(
        public readonly int $userId,
        public readonly int $todoId,
        public readonly array $data,
    ) {}
}
