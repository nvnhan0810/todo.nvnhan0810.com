<?php

namespace Modules\Todo\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Shared\Application\CommandBus;
use Modules\Shared\Application\QueryBus;
use Modules\Todo\Application\Command\CreateTodo;
use Modules\Todo\Application\Command\DeleteTodo;
use Modules\Todo\Application\Command\UpdateTodo;
use Modules\Todo\Application\Query\GetTodoFormData;
use Modules\Todo\Application\Query\ListTodos;
use Modules\Todo\Domain\TodoPriority;
use Modules\Todo\Domain\TodoStatus;

class TodoController extends Controller
{
    public function __construct(
        private readonly QueryBus $queries,
        private readonly CommandBus $commands,
    ) {}

    public function index(Request $request): Response
    {
        $projectId = $request->query('project_id');
        $search = $request->filled('search')
            ? mb_substr(trim($request->string('search')->toString()), 0, 200)
            : null;

        $data = $this->queries->ask(new ListTodos(
            is_numeric($projectId) ? (int) $projectId : null,
            $request->filled('status') ? $request->string('status')->toString() : null,
            $search !== null && $search !== '' ? $search : null,
        ));

        return Inertia::render('presentation/pages/admin/todos/ListPage', $data);
    }

    public function create(Request $request): Response
    {
        $data = $this->queries->ask(new GetTodoFormData(
            null,
            is_numeric($request->query('project_id')) ? (int) $request->query('project_id') : null,
        ));

        return Inertia::render('presentation/pages/admin/todos/FormPage', $data);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->commands->dispatch(new CreateTodo($this->validated($request)));

        return $this->redirectAfterSave($request);
    }

    public function edit(string $id): Response
    {
        $data = $this->queries->ask(new GetTodoFormData((int) $id));

        return Inertia::render('presentation/pages/admin/todos/FormPage', $data);
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $this->commands->dispatch(new UpdateTodo((int) $id, $this->validated($request)));

        return $this->redirectAfterSave($request);
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->commands->dispatch(new DeleteTodo((int) $id));

        return redirect()->route('todos.index');
    }

    private function redirectAfterSave(Request $request): RedirectResponse
    {
        if ($request->string('return_to')->toString() === 'matrix') {
            return redirect()->route('matrix.index');
        }

        return redirect()->route('todos.index');
    }

    /**
     * @return array{
     *   project_id: ?int,
     *   title: string,
     *   description: ?string,
     *   status: string,
     *   priority: string,
     *   due_at: ?string,
     *   is_urgent: bool,
     *   is_important: bool
     * }
     */
    private function validated(Request $request): array
    {
        $request->merge([
            'project_id' => $request->filled('project_id') ? $request->integer('project_id') : null,
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
            'due_at' => $request->filled('due_at') ? $request->string('due_at')->toString() : null,
            'is_urgent' => $request->boolean('is_urgent'),
            'is_important' => $request->boolean('is_important'),
        ]);

        /** @var array{
         *   project_id: ?int,
         *   title: string,
         *   description: ?string,
         *   status: string,
         *   priority: string,
         *   due_at: ?string,
         *   is_urgent: bool,
         *   is_important: bool
         * } $data
         */
        $data = $request->validate([
            'project_id' => ['nullable', 'integer', 'exists:todo_projects,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(TodoStatus::ALL)],
            'priority' => ['required', Rule::in(TodoPriority::ALL)],
            'due_at' => ['nullable', 'date'],
            'is_urgent' => ['boolean'],
            'is_important' => ['boolean'],
        ]);

        return $data;
    }
}
