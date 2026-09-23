<?php

namespace Modules\Todo\Domain\Ports;

interface ProjectRepository
{
    /**
     * @return list<array<string, mixed>>
     */
    public function listAll(): array;

    /**
     * @return list<array{id: int, name: string}>
     */
    public function listOptions(): array;

    /**
     * @return array<string, mixed>|null
     */
    public function findById(int $id): ?array;

    /**
     * @param  array{name: string, git_repo_url: ?string, domain: ?string}  $data
     * @return array<string, mixed>
     */
    public function create(array $data): array;

    /**
     * @param  array{name: string, git_repo_url: ?string, domain: ?string}  $data
     * @return array<string, mixed>
     */
    public function update(int $id, array $data): array;

    public function delete(int $id): void;
}
