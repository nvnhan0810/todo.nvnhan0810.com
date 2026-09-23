<?php

namespace Modules\Todo\Application\Query;

use Modules\Shared\Application\Query;

final class GetMatrixPageData implements Query
{
    public function __construct(public readonly int $userId) {}
}
