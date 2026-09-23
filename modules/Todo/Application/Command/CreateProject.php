<?php

namespace Modules\Todo\Application\Command;

use Modules\Shared\Application\Command;

final class CreateProject implements Command
{
    /**
     * @param  array{name: string, git_repo_url: ?string, domain: ?string}  $data
     */
    public function __construct(public readonly array $data) {}
}
