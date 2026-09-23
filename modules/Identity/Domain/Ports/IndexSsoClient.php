<?php

namespace Modules\Identity\Domain\Ports;

interface IndexSsoClient
{
    /**
     * @return array{sub: int, email: string, name: string, avatar: string|null}
     */
    public function exchangeAuthorizationCode(string $code): array;

    public function authorizeUrl(?string $state = null): string;

    public function validateState(?string $state): bool;
}
