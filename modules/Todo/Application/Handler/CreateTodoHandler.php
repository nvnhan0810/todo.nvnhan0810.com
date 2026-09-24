<?php

namespace Modules\Todo\Application\Handler;

use Modules\Shared\Application\Command;
use Modules\Shared\Application\CommandHandler;
use Modules\Todo\Application\Command\CreateTodo;
use Modules\Todo\Domain\Ports\TodoRepository;

final class CreateTodoHandler implements CommandHandler
{
    public function __construct(private readonly TodoRepository $todos) {}

    public function handle(Command $command): mixed
    {
        assert($command instanceof CreateTodo);

        return $this->todos->create($command->userId, $command->data);
    }
}
