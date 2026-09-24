<?php

namespace App\Observers;

use App\Models\Todo;
use Modules\Todo\Domain\Ports\MatrixStreamVersionStore;

class TodoObserver
{
    public function __construct(
        private readonly MatrixStreamVersionStore $matrixStreamVersion,
    ) {}

    public function saved(Todo $todo): void
    {
        $this->bumpFor($todo);
    }

    public function deleted(Todo $todo): void
    {
        $this->bumpFor($todo);
    }

    public function restored(Todo $todo): void
    {
        $this->bumpFor($todo);
    }

    public function forceDeleted(Todo $todo): void
    {
        $this->bumpFor($todo);
    }

    private function bumpFor(Todo $todo): void
    {
        $userId = (int) ($todo->user_id ?? 0);
        if ($userId <= 0) {
            return;
        }

        $this->matrixStreamVersion->bump($userId);
    }
}
