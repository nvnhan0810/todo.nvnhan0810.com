<?php

namespace Modules\Identity\Application\Handler;

use Modules\Identity\Application\Query\IsEmailAllowed;
use Modules\Identity\Domain\EmailAllowlist;
use Modules\Shared\Application\Query;
use Modules\Shared\Application\QueryHandler;

final class IsEmailAllowedHandler implements QueryHandler
{
    public function handle(Query $query): mixed
    {
        assert($query instanceof IsEmailAllowed);

        /** @var list<string> $patterns */
        $patterns = array_values(array_filter(
            array_map('strval', (array) config('auth.valid_emails', [])),
        ));

        return EmailAllowlist::isAllowed($query->email, $patterns);
    }
}
