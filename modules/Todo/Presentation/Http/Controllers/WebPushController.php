<?php

namespace Modules\Todo\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Modules\Shared\Application\CommandBus;
use Modules\Shared\Application\QueryBus;
use Modules\Todo\Application\Command\SubscribeWebPush;
use Modules\Todo\Application\Command\UnsubscribeWebPush;
use Modules\Todo\Application\Command\UpdateWebPushPresence;
use Modules\Todo\Application\Query\GetWebPushPublicKey;
use Modules\Todo\Application\Query\GetWebPushStatus;

class WebPushController extends Controller
{
    public function __construct(
        private readonly QueryBus $queries,
        private readonly CommandBus $commands,
    ) {}

    public function publicKey(): JsonResponse
    {
        /** @var array{configured: bool, publicKey: ?string, httpStatus: int} $result */
        $result = $this->queries->ask(new GetWebPushPublicKey);

        return response()->json([
            'configured' => $result['configured'],
            'publicKey' => $result['publicKey'],
        ], $result['httpStatus']);
    }

    public function subscribe(Request $request): JsonResponse
    {
        $data = $request->validate([
            'endpoint' => ['required', 'string', 'max:2000'],
            'keys' => ['required', 'array'],
            'keys.p256dh' => ['required', 'string', 'max:255'],
            'keys.auth' => ['required', 'string', 'max:255'],
            'contentEncoding' => ['nullable', 'string', 'max:32'],
        ]);

        $this->commands->dispatch(new SubscribeWebPush(
            (int) Auth::id(),
            $data['endpoint'],
            $data['keys']['p256dh'],
            $data['keys']['auth'],
            $data['contentEncoding'] ?? 'aes128gcm',
            $request->userAgent(),
        ));

        return response()->json(['ok' => true]);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $data = $request->validate([
            'endpoint' => ['required', 'string', 'max:2000'],
        ]);

        $this->commands->dispatch(new UnsubscribeWebPush((int) Auth::id(), $data['endpoint']));

        return response()->json(['ok' => true]);
    }

    public function presence(Request $request): JsonResponse
    {
        $data = $request->validate([
            'endpoint' => ['required', 'string', 'max:2000'],
            'focused' => ['required', 'boolean'],
        ]);

        $this->commands->dispatch(new UpdateWebPushPresence(
            (int) Auth::id(),
            $data['endpoint'],
            $request->boolean('focused'),
        ));

        return response()->json(['ok' => true]);
    }

    public function status(): JsonResponse
    {
        return response()->json($this->queries->ask(new GetWebPushStatus((int) Auth::id())));
    }
}
