<?php

namespace Modules\Todo\Application\Query;

use Modules\Shared\Application\Query;

final class ListTodos implements Query
{
    public function __construct(
        public readonly ?int $projectId = null,
        public readonly ?string $status = null,
        public readonly int $perPage = 20,
    ) {}
}
