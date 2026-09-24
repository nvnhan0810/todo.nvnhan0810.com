<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\DeleteTodo;
use Modules\Todo\Domain\Ports\TodoRepository;

final class DeleteTodoHandler implements CommandHandler
{
    public function __construct(private readonly TodoRepository $todos) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof DeleteTodo);
        $this->todos->delete($command->userId, $command->todoId);

        return null;
    }
}
