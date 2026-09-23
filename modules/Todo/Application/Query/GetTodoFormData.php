<?php

namespace Modules\Todo\Application\Query;

use Modules\Shared\Application\Query;

final class GetTodoFormData implements Query
{
    public function __construct(
        public readonly ?int $todoId = null,
        public readonly ?int $defaultProjectId = null,
    ) {}
}
