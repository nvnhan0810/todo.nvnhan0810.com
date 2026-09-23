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
        $this->matrixStreamVersion->bump();
    }

    public function deleted(Todo $todo): void
    {
        $this->matrixStreamVersion->bump();
    }

    public function restored(Todo $todo): void
    {
        $this->matrixStreamVersion->bump();
    }

    public function forceDeleted(Todo $todo): void
    {
        $this->matrixStreamVersion->bump();
    }
}
