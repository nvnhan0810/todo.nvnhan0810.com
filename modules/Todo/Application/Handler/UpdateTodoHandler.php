<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\UpdateTodo;
use Modules\Todo\Domain\Ports\TodoRepository;

final class UpdateTodoHandler implements CommandHandler
{
    public function __construct(private readonly TodoRepository $todos) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof UpdateTodo);

        return $this->todos->update($command->todoId, $command->data);
    }
}
