<?php

namespace Modules\Todo\Domain\Ports;

/**
 * Persistence port for todos + related matrix/CRUD reads/writes.
 * Returns array shapes suitable for Inertia / JSON (no Eloquent leakage).
 */
interface TodoRepository
{
    public const ACTIVE_STATUSES = ['todo', 'in_progress'];

    public const SOURCE_STATUS = 'backlog';

    public const TARGET_STATUS = 'todo';

    public const STATUSES = ['backlog', 'todo', 'in_progress', 'done', 'rejected'];

    public const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

    /**
     * @return array{
     *   do: list<array<string, mixed>>,
     *   schedule: list<array<string, mixed>>,
     *   delegate: list<array<string, mixed>>,
     *   eliminate: list<array<string, mixed>>
     * }
     */
    public function listActiveByQuadrant(): array;

    /**
     * @return list<array<string, mixed>>
     */
    public function listBacklog(): array;

    /**
     * @param  array{project_id?: int|null, status?: string|null}  $filters
     * @return array{data: list<array<string, mixed>>, meta: array<string, mixed>}
     */
    public function paginate(array $filters, int $perPage = 20): array;

    /**
     * @return array<string, mixed>|null
     */
    public function findById(int $id): ?array;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function create(array $data): array;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function update(int $id, array $data): array;

    public function delete(int $id): void;

    /**
     * @param  array{is_urgent: bool, is_important: bool, status?: string}  $data
     * @return array<string, mixed>
     */
    public function updateMatrixFlags(int $id, array $data, ?int $actorUserId): array;

    /**
     * @return array<string, mixed>
     */
    public function markComplete(int $id): array;

    /**
     * @param  list<array{id: int, is_urgent: bool, is_important: bool}>  $items
     */
    public function promoteBacklogItems(array $items, ?int $actorUserId): int;
}
