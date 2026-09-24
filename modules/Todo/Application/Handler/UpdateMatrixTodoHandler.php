<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\UpdateMatrixTodo;
use Modules\Todo\Domain\Ports\TodoRepository;

final class UpdateMatrixTodoHandler implements CommandHandler
{
    public function __construct(private readonly TodoRepository $todos) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof UpdateMatrixTodo);

        return $this->todos->updateMatrixFlags($command->userId, $command->todoId, [
            'is_urgent' => $command->isUrgent,
            'is_important' => $command->isImportant,
            'status' => $command->status,
        ], $command->actorUserId);
    }
}
