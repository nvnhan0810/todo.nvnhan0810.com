<?php

namespace Modules\Todo;

use App\Models\Todo;
use App\Observers\TodoObserver;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Modules\Shared\Application\CommandBus;
use Modules\Shared\Application\QueryBus;
use Modules\Shared\Infrastructure\Bus\LaravelCommandBus;
use Modules\Shared\Infrastructure\Bus\LaravelQueryBus;
use Modules\Todo\Application\Command\CompleteMatrixTodo;
use Modules\Todo\Application\Command\CreateProject;
use Modules\Todo\Application\Command\CreateTodo;
use Modules\Todo\Application\Command\DeleteProject;
use Modules\Todo\Application\Command\DeleteTodo;
use Modules\Todo\Application\Command\DeliverPomodoroPhasePush;
use Modules\Todo\Application\Command\PausePomodoro;
use Modules\Todo\Application\Command\PromoteBacklogItems;
use Modules\Todo\Application\Command\ResetPomodoro;
use Modules\Todo\Application\Command\SelectPomodoroActiveTodo;
use Modules\Todo\Application\Command\SkipPomodoroPhase;
use Modules\Todo\Application\Command\StartPomodoro;
use Modules\Todo\Application\Command\SubscribeWebPush;
use Modules\Todo\Application\Command\TouchPomodoroFocus;
use Modules\Todo\Application\Command\UnsubscribeWebPush;
use Modules\Todo\Application\Command\UpdateMatrixTodo;
use Modules\Todo\Application\Command\UpdatePomodoroSettings;
use Modules\Todo\Application\Command\UpdateProject;
use Modules\Todo\Application\Command\UpdateTodo;
use Modules\Todo\Application\Command\UpdateWebPushPresence;
use Modules\Todo\Application\Handler\CompleteMatrixTodoHandler;
use Modules\Todo\Application\Handler\CreateProjectHandler;
use Modules\Todo\Application\Handler\CreateTodoHandler;
use Modules\Todo\Application\Handler\DeleteProjectHandler;
use Modules\Todo\Application\Handler\DeleteTodoHandler;
use Modules\Todo\Application\Handler\DeliverPomodoroPhasePushHandler;
use Modules\Todo\Application\Handler\GetMatrixPageDataHandler;
use Modules\Todo\Application\Handler\GetPomodoroStateHandler;
use Modules\Todo\Application\Handler\GetProjectFormDataHandler;
use Modules\Todo\Application\Handler\GetTodoFormDataHandler;
use Modules\Todo\Application\Handler\GetWebPushPublicKeyHandler;
use Modules\Todo\Application\Handler\GetWebPushStatusHandler;
use Modules\Todo\Application\Handler\ListProjectsHandler;
use Modules\Todo\Application\Handler\ListTodosHandler;
use Modules\Todo\Application\Handler\PausePomodoroHandler;
use Modules\Todo\Application\Handler\PromoteBacklogItemsHandler;
use Modules\Todo\Application\Handler\ResetPomodoroHandler;
use Modules\Todo\Application\Handler\SelectPomodoroActiveTodoHandler;
use Modules\Todo\Application\Handler\SkipPomodoroPhaseHandler;
use Modules\Todo\Application\Handler\StartPomodoroHandler;
use Modules\Todo\Application\Handler\SubscribeWebPushHandler;
use Modules\Todo\Application\Handler\TouchPomodoroFocusHandler;
use Modules\Todo\Application\Handler\UnsubscribeWebPushHandler;
use Modules\Todo\Application\Handler\UpdateMatrixTodoHandler;
use Modules\Todo\Application\Handler\UpdatePomodoroSettingsHandler;
use Modules\Todo\Application\Handler\UpdateProjectHandler;
use Modules\Todo\Application\Handler\UpdateTodoHandler;
use Modules\Todo\Application\Handler\UpdateWebPushPresenceHandler;
use Modules\Todo\Application\Query\GetMatrixPageData;
use Modules\Todo\Application\Query\GetPomodoroState;
use Modules\Todo\Application\Query\GetProjectFormData;
use Modules\Todo\Application\Query\GetTodoFormData;
use Modules\Todo\Application\Query\GetWebPushPublicKey;
use Modules\Todo\Application\Query\GetWebPushStatus;
use Modules\Todo\Application\Query\ListProjects;
use Modules\Todo\Application\Query\ListTodos;
use Modules\Todo\Domain\Ports\MatrixStreamVersionStore;
use Modules\Todo\Domain\Ports\PomodoroPhaseJobScheduler;
use Modules\Todo\Domain\Ports\PomodoroStateRepository;
use Modules\Todo\Domain\Ports\PomodoroStreamVersionStore;
use Modules\Todo\Domain\Ports\ProjectRepository;
use Modules\Todo\Domain\Ports\TodoRepository;
use Modules\Todo\Domain\Ports\WebPushSender;
use Modules\Todo\Domain\Ports\WebPushSubscriptionRepository;
use Modules\Todo\Infrastructure\CacheMatrixStreamVersionStore;
use Modules\Todo\Infrastructure\CachePomodoroStreamVersionStore;
use Modules\Todo\Infrastructure\EloquentPomodoroStateRepository;
use Modules\Todo\Infrastructure\EloquentProjectRepository;
use Modules\Todo\Infrastructure\EloquentTodoRepository;
use Modules\Todo\Infrastructure\EloquentWebPushSubscriptionRepository;
use Modules\Todo\Infrastructure\LaravelPomodoroPhaseJobScheduler;
use Modules\Todo\Infrastructure\MinishlinkWebPushSender;

class TodoServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PomodoroStateRepository::class, EloquentPomodoroStateRepository::class);
        $this->app->bind(WebPushSubscriptionRepository::class, EloquentWebPushSubscriptionRepository::class);
        $this->app->bind(WebPushSender::class, MinishlinkWebPushSender::class);
        $this->app->bind(PomodoroPhaseJobScheduler::class, LaravelPomodoroPhaseJobScheduler::class);
        $this->app->bind(TodoRepository::class, EloquentTodoRepository::class);
        $this->app->bind(ProjectRepository::class, EloquentProjectRepository::class);
        $this->app->singleton(MatrixStreamVersionStore::class, CacheMatrixStreamVersionStore::class);
        $this->app->singleton(PomodoroStreamVersionStore::class, CachePomodoroStreamVersionStore::class);

        $this->callAfterResolving(QueryBus::class, function (QueryBus $bus): void {
            if (! $bus instanceof LaravelQueryBus) {
                return;
            }

            $bus->register(GetMatrixPageData::class, GetMatrixPageDataHandler::class);
            $bus->register(GetPomodoroState::class, GetPomodoroStateHandler::class);
            $bus->register(ListTodos::class, ListTodosHandler::class);
            $bus->register(GetTodoFormData::class, GetTodoFormDataHandler::class);
            $bus->register(ListProjects::class, ListProjectsHandler::class);
            $bus->register(GetProjectFormData::class, GetProjectFormDataHandler::class);
            $bus->register(GetWebPushPublicKey::class, GetWebPushPublicKeyHandler::class);
            $bus->register(GetWebPushStatus::class, GetWebPushStatusHandler::class);
        });

        $this->callAfterResolving(CommandBus::class, function (CommandBus $bus): void {
            if (! $bus instanceof LaravelCommandBus) {
                return;
            }

            $bus->register(StartPomodoro::class, StartPomodoroHandler::class);
            $bus->register(PausePomodoro::class, PausePomodoroHandler::class);
            $bus->register(SkipPomodoroPhase::class, SkipPomodoroPhaseHandler::class);
            $bus->register(ResetPomodoro::class, ResetPomodoroHandler::class);
            $bus->register(UpdatePomodoroSettings::class, UpdatePomodoroSettingsHandler::class);
            $bus->register(SelectPomodoroActiveTodo::class, SelectPomodoroActiveTodoHandler::class);
            $bus->register(TouchPomodoroFocus::class, TouchPomodoroFocusHandler::class);
            $bus->register(DeliverPomodoroPhasePush::class, DeliverPomodoroPhasePushHandler::class);
            $bus->register(SubscribeWebPush::class, SubscribeWebPushHandler::class);
            $bus->register(UnsubscribeWebPush::class, UnsubscribeWebPushHandler::class);
            $bus->register(UpdateWebPushPresence::class, UpdateWebPushPresenceHandler::class);
            $bus->register(PromoteBacklogItems::class, PromoteBacklogItemsHandler::class);
            $bus->register(UpdateMatrixTodo::class, UpdateMatrixTodoHandler::class);
            $bus->register(CompleteMatrixTodo::class, CompleteMatrixTodoHandler::class);
            $bus->register(CreateTodo::class, CreateTodoHandler::class);
            $bus->register(UpdateTodo::class, UpdateTodoHandler::class);
            $bus->register(DeleteTodo::class, DeleteTodoHandler::class);
            $bus->register(CreateProject::class, CreateProjectHandler::class);
            $bus->register(UpdateProject::class, UpdateProjectHandler::class);
            $bus->register(DeleteProject::class, DeleteProjectHandler::class);
        });
    }

    public function boot(): void
    {
        Todo::observe(TodoObserver::class);

        Route::middleware('web')->group(base_path('routes/todo.php'));
    }
}
