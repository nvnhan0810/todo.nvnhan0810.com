<?php

namespace Modules\Todo\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Shared\Application\CommandBus;
use Modules\Shared\Application\QueryBus;
use Modules\Todo\Application\Command\CompleteMatrixTodo;
use Modules\Todo\Application\Command\PausePomodoro;
use Modules\Todo\Application\Command\PromoteBacklogItems;
use Modules\Todo\Application\Command\ResetPomodoro;
use Modules\Todo\Application\Command\SelectPomodoroActiveTodo;
use Modules\Todo\Application\Command\SkipPomodoroPhase;
use Modules\Todo\Application\Command\StartPomodoro;
use Modules\Todo\Application\Command\TouchPomodoroFocus;
use Modules\Todo\Application\Command\UpdateMatrixTodo;
use Modules\Todo\Application\Command\UpdatePomodoroSettings;
use Modules\Todo\Application\Query\GetMatrixPageData;
use Modules\Todo\Application\Query\GetPomodoroState;
use Modules\Todo\Domain\Ports\MatrixStreamVersionStore;
use Modules\Todo\Domain\Ports\PomodoroStreamVersionStore;
use Modules\Todo\Domain\TodoStatus;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MatrixController extends Controller
{
    public function __construct(

        private readonly QueryBus $queries,
        private readonly CommandBus $commands,
        private readonly MatrixStreamVersionStore $matrixStreamVersion,
        private readonly PomodoroStreamVersionStore $pomodoroStreamVersion,
    ) {}

    public function index(): Response
    {
        $userId = (int) Auth::id();
        $data = $this->queries->ask(new GetMatrixPageData($userId));

        return Inertia::render('presentation/pages/matrix/MatrixPage', [
            ...$data,
            'stream_url' => route('matrix.stream'),
        ]);
    }

    public function stream(Request $request): StreamedResponse
    {
        if ($request->hasSession()) {
            $request->session()->save();
        }

        $userId = (int) Auth::id();

        return response()->stream(function () use ($userId): void {
            @ini_set('zlib.output_compression', '0');
            @ini_set('implicit_flush', '1');
            while (ob_get_level() > 0) {
                ob_end_flush();
            }

            $lastMatrixVersion = -1;
            $lastPomodoroVersion = -1;
            $startedAt = time();
            $maxSeconds = 120;

            while (! connection_aborted() && (time() - $startedAt) < $maxSeconds) {
                $matrixVersion = $this->matrixStreamVersion->current($userId);
                $pomodoroVersion = $this->pomodoroStreamVersion->current($userId);
                $sentEvent = false;

                if ($matrixVersion !== $lastMatrixVersion) {
                    $lastMatrixVersion = $matrixVersion;
                    $page = $this->queries->ask(new GetMatrixPageData($userId));
                    $payload = json_encode([
                        'version' => $matrixVersion,
                        'quadrants' => $page['quadrants'],
                    ], JSON_THROW_ON_ERROR);

                    echo "event: matrix\n";
                    echo 'data: '.$payload."\n\n";
                    $sentEvent = true;
                }

                if ($pomodoroVersion !== $lastPomodoroVersion) {
                    $lastPomodoroVersion = $pomodoroVersion;
                    $pomodoroPayload = json_encode(
                        $this->queries->ask(new GetPomodoroState($userId)),
                        JSON_THROW_ON_ERROR,
                    );

                    echo "event: pomodoro\n";
                    echo 'data: '.$pomodoroPayload."\n\n";
                    $sentEvent = true;
                }

                if (! $sentEvent) {
                    echo ": ping\n\n";
                }

                if (function_exists('flush')) {
                    flush();
                }

                usleep(1_000_000);
            }
        }, 200, [
            'Content-Type' => 'text/event-stream; charset=UTF-8',
            'Cache-Control' => 'no-cache, no-store',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    public function showPomodoro(): JsonResponse
    {
        return response()->json($this->queries->ask(new GetPomodoroState((int) Auth::id())));
    }

    public function startPomodoro(Request $request): JsonResponse
    {
        $userId = (int) Auth::id();
        $data = $request->validate([
            'activeTodoId' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('todos', 'id')->where(fn ($q) => $q->where('user_id', $userId)),
            ],
        ]);

        $activeTodoId = array_key_exists('activeTodoId', $data) && is_numeric($data['activeTodoId'] ?? null)
            ? (int) $data['activeTodoId']
            : null;

        return response()->json($this->commands->dispatch(new StartPomodoro($userId, $activeTodoId)));
    }

    public function pausePomodoro(): JsonResponse
    {
        return response()->json($this->commands->dispatch(new PausePomodoro((int) Auth::id())));
    }

    public function skipPomodoro(): JsonResponse
    {
        return response()->json($this->commands->dispatch(new SkipPomodoroPhase((int) Auth::id())));
    }

    public function resetPomodoro(): JsonResponse
    {
        return response()->json($this->commands->dispatch(new ResetPomodoro((int) Auth::id())));
    }

    public function updatePomodoroSettings(Request $request): JsonResponse
    {
        $data = $request->validate([
            'focusMinutes' => ['required', 'integer', 'min:1', 'max:180'],
            'shortBreakMinutes' => ['required', 'integer', 'min:1', 'max:60'],
            'sessionsBeforeLongBreak' => ['required', 'integer', 'min:1', 'max:12'],
            'longBreakMinutes' => ['required', 'integer', 'min:1', 'max:60'],
        ]);

        return response()->json($this->commands->dispatch(new UpdatePomodoroSettings((int) Auth::id(), $data)));
    }

    public function updatePomodoroActiveTodo(Request $request): JsonResponse
    {
        $userId = (int) Auth::id();
        $data = $request->validate([
            'activeTodoId' => [
                'nullable',
                'integer',
                Rule::exists('todos', 'id')->where(fn ($q) => $q->where('user_id', $userId)),
            ],
        ]);

        $activeTodoId = isset($data['activeTodoId']) && is_numeric($data['activeTodoId'])
            ? (int) $data['activeTodoId']
            : null;

        return response()->json($this->commands->dispatch(new SelectPomodoroActiveTodo($userId, $activeTodoId)));
    }

    public function focusPomodoro(Request $request): JsonResponse
    {
        $data = $request->validate([
            'sessionUuid' => ['required', 'uuid'],
            'focused' => ['required', 'boolean'],
        ]);

        $this->commands->dispatch(new TouchPomodoroFocus(
            (int) Auth::id(),
            (string) $data['sessionUuid'],
            $request->boolean('focused'),
        ));

        return response()->json(['ok' => true]);
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $userId = (int) Auth::id();
        $data = $request->validate([
            'is_urgent' => ['required', 'boolean'],
            'is_important' => ['required', 'boolean'],
            'status' => ['sometimes', Rule::in(TodoStatus::ACTIVE)],
        ]);

        $this->commands->dispatch(new UpdateMatrixTodo(
            $userId,
            (int) $id,
            $request->boolean('is_urgent'),
            $request->boolean('is_important'),
            $data['status'] ?? null,
            $userId,
        ));

        return redirect()->route('matrix.index');
    }

    public function promoteBacklog(Request $request): RedirectResponse
    {
        $userId = (int) Auth::id();
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('todos', 'id')->where(fn ($q) => $q->where('user_id', $userId)),
            ],
            'items.*.is_urgent' => ['required', 'boolean'],
            'items.*.is_important' => ['required', 'boolean'],
        ]);

        /** @var list<array{id: int, is_urgent: bool, is_important: bool}> $items */
        $items = array_map(
            static fn (array $item): array => [
                'id' => (int) $item['id'],
                'is_urgent' => filter_var($item['is_urgent'], FILTER_VALIDATE_BOOLEAN),
                'is_important' => filter_var($item['is_important'], FILTER_VALIDATE_BOOLEAN),
            ],
            $data['items'],
        );

        $this->commands->dispatch(new PromoteBacklogItems(
            $userId,
            $items,
            $userId,
        ));

        return redirect()->route('matrix.index');
    }

    public function complete(string $id): RedirectResponse
    {
        $this->commands->dispatch(new CompleteMatrixTodo((int) Auth::id(), (int) $id));

        return redirect()->route('matrix.index');
    }
}
