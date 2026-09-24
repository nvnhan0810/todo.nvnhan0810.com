<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\CompleteMatrixTodo;
use Modules\Todo\Domain\Ports\TodoRepository;

final class CompleteMatrixTodoHandler implements CommandHandler
{
    public function __construct(private readonly TodoRepository $todos) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof CompleteMatrixTodo);

        return $this->todos->markComplete($command->userId, $command->todoId);
    }
}
