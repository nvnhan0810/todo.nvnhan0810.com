<?php

namespace Modules\Todo\Infrastructure;

use App\Models\TodoProject;
use Modules\Todo\Domain\Ports\ProjectRepository;

final class EloquentProjectRepository implements ProjectRepository
{
    public function listAll(): array
    {
        return TodoProject::query()
            ->withCount('todos')
            ->orderBy('name')
            ->get()
            ->toArray();
    }

    public function listOptions(): array
    {
        return TodoProject::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->toArray();
    }

    public function findById(int $id): ?array
    {
        return TodoProject::query()->find($id)?->toArray();
    }

    public function create(array $data): array
    {
        return TodoProject::query()->create($data)->toArray();
    }

    public function update(int $id, array $data): array
    {
        $project = TodoProject::query()->findOrFail($id);
        $project->update($data);

        return $project->fresh()->toArray();
    }

    public function delete(int $id): void
    {
        TodoProject::query()->findOrFail($id)->delete();
    }
}
