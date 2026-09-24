<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class UpdateProject implements Command
{
    /**
     * @param  array{name: string, git_repo_url: ?string, domain: ?string}  $data
     */
    public function __construct(
        public readonly int $userId,
        public readonly int $projectId,
        public readonly array $data,
    ) {}
}
