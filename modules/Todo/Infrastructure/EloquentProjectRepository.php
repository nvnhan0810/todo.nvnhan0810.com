<?php

namespace Modules\Todo\Infrastructure;

use App\Models\TodoProject;
use Illuminate\Database\Eloquent\Builder;
use Modules\Todo\Domain\Ports\ProjectRepository;

final class EloquentProjectRepository implements ProjectRepository
{
    public function listAll(int $userId): array
    {
        return $this->owned($userId)
            ->withCount('todos')
            ->orderBy('name')
            ->get()
            ->toArray();
    }

    public function listOptions(int $userId): array
    {
        return $this->owned($userId)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->toArray();
    }

    public function findById(int $userId, int $id): ?array
    {
        return $this->owned($userId)->find($id)?->toArray();
    }

    public function create(int $userId, array $data): array
    {
        $data['user_id'] = $userId;

        return TodoProject::query()->create($data)->toArray();
    }

    public function update(int $userId, int $id, array $data): array
    {
        $project = $this->owned($userId)->findOrFail($id);
        unset($data['user_id']);
        $project->update($data);

        return $project->fresh()->toArray();
    }

    public function delete(int $userId, int $id): void
    {
        $this->owned($userId)->findOrFail($id)->delete();
    }

    /**
     * @return Builder<TodoProject>
     */
    private function owned(int $userId): Builder
    {
        return TodoProject::query()->where('user_id', $userId);
    }
}
