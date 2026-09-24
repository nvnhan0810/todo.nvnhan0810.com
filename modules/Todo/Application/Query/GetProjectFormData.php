<?php

namespace Modules\Todo\Application\Query;

use Modules\Shared\Application\Query;

final class GetProjectFormData implements Query
{
    public function __construct(
        public readonly int $userId,
        public readonly ?int $projectId = null,
    ) {}
}
