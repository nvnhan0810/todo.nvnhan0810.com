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
use Modules\Todo\Application\Command\CreateProject;
use Modules\Todo\Application\Command\DeleteProject;
use Modules\Todo\Application\Command\UpdateProject;
use Modules\Todo\Application\Query\GetProjectFormData;
use Modules\Todo\Application\Query\ListProjects;

class ProjectController extends Controller
{
    public function __construct(
        private readonly QueryBus $queries,
        private readonly CommandBus $commands,
    ) {}

    public function index(): Response
    {
        return Inertia::render(
            'presentation/pages/admin/projects/ListPage',
            $this->queries->ask(new ListProjects),
        );
    }

    public function create(): Response
    {
        return Inertia::render(
            'presentation/pages/admin/projects/FormPage',
            $this->queries->ask(new GetProjectFormData),
        );
    }

    public function store(Request $request): RedirectResponse
    {
        $this->commands->dispatch(new CreateProject($this->validated($request)));

        return redirect()->route('todos.projects.index');
    }

    public function edit(string $id): Response
    {
        return Inertia::render(
            'presentation/pages/admin/projects/FormPage',
            $this->queries->ask(new GetProjectFormData((int) $id)),
        );
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $this->commands->dispatch(new UpdateProject((int) $id, $this->validated($request, (int) $id)));

        return redirect()->route('todos.projects.index');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->commands->dispatch(new DeleteProject((int) $id));

        return redirect()->route('todos.projects.index');
    }

    /**
     * @return array{name: string, git_repo_url: ?string, domain: ?string}
     */
    private function validated(Request $request, ?int $ignoreId = null): array
    {
        $request->merge([
            'git_repo_url' => $request->filled('git_repo_url') ? $request->string('git_repo_url')->toString() : null,
            'domain' => $request->filled('domain') ? $request->string('domain')->toString() : null,
        ]);

        $uniqueRepo = Rule::unique('todo_projects', 'git_repo_url');
        if ($ignoreId !== null) {
            $uniqueRepo = $uniqueRepo->ignore($ignoreId);
        }

        /** @var array{name: string, git_repo_url: ?string, domain: ?string} $data */
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'git_repo_url' => ['nullable', 'string', 'max:2048', $uniqueRepo],
            'domain' => ['nullable', 'string', 'max:255'],
        ]);

        return $data;
    }
}
