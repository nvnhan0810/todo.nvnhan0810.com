<?php

namespace Modules\Todo\Domain\Ports;

interface ProjectRepository
{
    /**
     * @return list<array<string, mixed>>
     */
    public function listAll(int $userId): array;

    /**
     * @return list<array{id: int, name: string}>
     */
    public function listOptions(int $userId): array;

    /**
     * @return array<string, mixed>|null
     */
    public function findById(int $userId, int $id): ?array;

    /**
     * @param  array{name: string, git_repo_url: ?string, domain: ?string}  $data
     * @return array<string, mixed>
     */
    public function create(int $userId, array $data): array;

    /**
     * @param  array{name: string, git_repo_url: ?string, domain: ?string}  $data
     * @return array<string, mixed>
     */
    public function update(int $userId, int $id, array $data): array;

    public function delete(int $userId, int $id): void;
}
