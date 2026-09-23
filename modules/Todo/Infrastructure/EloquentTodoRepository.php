<?php

namespace Modules\Todo\Infrastructure;

use App\Models\EisenhowerLog;
use App\Models\Todo;
use Illuminate\Support\Facades\DB;
use Modules\Todo\Domain\Ports\TodoRepository;
use Modules\Todo\Domain\TodoPriority;
use Modules\Todo\Domain\TodoStatus;

final class EloquentTodoRepository implements TodoRepository
{
    public function listActiveByQuadrant(): array
    {
        $todos = Todo::query()
            ->with('project:id,name')
            ->whereIn('status', TodoStatus::ACTIVE)
            ->orderByRaw("CASE priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->orderByRaw('due_at ASC NULLS LAST')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        $map = static fn ($t) => $t->toArray();

        return [
            'do' => $todos->filter(fn (Todo $t) => $t->is_urgent && $t->is_important)->values()->map($map)->all(),
            'schedule' => $todos->filter(fn (Todo $t) => ! $t->is_urgent && $t->is_important)->values()->map($map)->all(),
            'delegate' => $todos->filter(fn (Todo $t) => $t->is_urgent && ! $t->is_important)->values()->map($map)->all(),
            'eliminate' => $todos->filter(fn (Todo $t) => ! $t->is_urgent && ! $t->is_important)->values()->map($map)->all(),
        ];
    }

    public function listBacklog(): array
    {
        return Todo::query()
            ->with('project:id,name')
            ->where('status', TodoStatus::BACKLOG)
            ->orderByRaw("CASE priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->orderBy('due_at')
            ->orderByDesc('updated_at')
            ->get()
            ->toArray();
    }

    public function paginate(array $filters, int $perPage = 20): array
    {
        $paginator = Todo::query()
            ->with('project:id,name')
            ->when(
                isset($filters['project_id']) && is_numeric($filters['project_id']),
                fn ($q) => $q->where('project_id', (int) $filters['project_id']),
            )
            ->when(
                isset($filters['status']) && is_string($filters['status']) && $filters['status'] !== '',
                fn ($q) => $q->where('status', $filters['status']),
            )
            ->orderByDesc('updated_at')
            ->paginate($perPage)
            ->withQueryString();

        return $paginator->toArray();
    }

    public function findById(int $id): ?array
    {
        $todo = Todo::query()->with('project:id,name')->find($id);

        return $todo?->toArray();
    }

    public function create(array $data): array
    {
        return Todo::query()->create($data)->fresh(['project:id,name'])->toArray();
    }

    public function update(int $id, array $data): array
    {
        $todo = Todo::query()->findOrFail($id);

        if (($data['status'] ?? null) === TodoStatus::DONE && $todo->closed_at === null) {
            $data['closed_at'] = now();
        }
        if (($data['status'] ?? null) === TodoStatus::IN_PROGRESS && $todo->started_at === null) {
            $data['started_at'] = now();
        }
        if (isset($data['status']) && ! in_array($data['status'], [TodoStatus::DONE, TodoStatus::REJECTED], true)) {
            $data['closed_at'] = null;
        }

        $todo->update($data);

        return $todo->fresh(['project:id,name'])->toArray();
    }

    public function delete(int $id): void
    {
        Todo::query()->findOrFail($id)->delete();
    }

    public function updateMatrixFlags(int $id, array $data, ?int $actorUserId): array
    {
        $todo = Todo::query()
            ->whereIn('status', TodoStatus::ACTIVE)
            ->findOrFail($id);

        $status = $data['status'] ?? $todo->status;
        $todo->update([
            'is_urgent' => $data['is_urgent'],
            'is_important' => $data['is_important'],
            'status' => $status,
            'started_at' => $status === TodoStatus::IN_PROGRESS && $todo->started_at === null
                ? now()
                : $todo->started_at,
        ]);

        if ($actorUserId !== null) {
            EisenhowerLog::query()->create([
                'todo_id' => $todo->id,
                'is_urgent' => $todo->is_urgent,
                'is_important' => $todo->is_important,
                'created_by' => $actorUserId,
            ]);
        }

        return $todo->fresh()->toArray();
    }

    public function markComplete(int $id): array
    {
        $todo = Todo::query()
            ->whereIn('status', TodoStatus::ACTIVE)
            ->findOrFail($id);

        $todo->update([
            'status' => TodoStatus::DONE,
            'closed_at' => now(),
        ]);

        return $todo->fresh()->toArray();
    }

    public function promoteBacklogItems(array $items, ?int $actorUserId): int
    {
        if ($items === []) {
            return 0;
        }

        return (int) DB::transaction(function () use ($items, $actorUserId): int {
            $ids = array_values(array_unique(array_map(
                static fn (array $item): int => $item['id'],
                $items,
            )));

            $todos = Todo::query()
                ->where('status', TodoStatus::BACKLOG)
                ->whereIn('id', $ids)
                ->get()
                ->keyBy('id');

            $updated = 0;

            foreach ($items as $item) {
                $todo = $todos->get($item['id']);
                if ($todo === null) {
                    continue;
                }

                $todo->update([
                    'status' => TodoStatus::TODO,
                    'is_urgent' => $item['is_urgent'],
                    'is_important' => $item['is_important'],
                ]);

                if ($actorUserId !== null) {
                    EisenhowerLog::query()->create([
                        'todo_id' => $todo->id,
                        'is_urgent' => $todo->is_urgent,
                        'is_important' => $todo->is_important,
                        'created_by' => $actorUserId,
                    ]);
                }

                $updated++;
            }

            return $updated;
        });
    }
}
