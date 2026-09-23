<?php

namespace Modules\Identity;

use Illuminate\Support\ServiceProvider;
use Modules\Identity\Application\Handler\IsEmailAllowedHandler;
use Modules\Identity\Application\Query\IsEmailAllowed;
use Modules\Identity\Domain\Ports\IndexSsoClient;
use Modules\Identity\Infrastructure\Sso\LaravelIndexSsoClient;
use Modules\Shared\Application\QueryBus;
use Modules\Shared\Infrastructure\Bus\LaravelQueryBus;

class IdentityServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(IndexSsoClient::class, LaravelIndexSsoClient::class);

        $this->callAfterResolving(QueryBus::class, function (QueryBus $bus): void {
            if (! $bus instanceof LaravelQueryBus) {
                return;
            }

            $bus->register(IsEmailAllowed::class, IsEmailAllowedHandler::class);
        });
    }
}
