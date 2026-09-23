<?php

namespace Modules\Identity\Application\Query;

use Modules\Shared\Application\Query;

final class IsEmailAllowed implements Query
{
    public function __construct(public readonly string $email) {}
}
