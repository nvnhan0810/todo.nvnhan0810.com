<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class DeleteProject implements Command
{
    public function __construct(public readonly int $projectId) {}
}
