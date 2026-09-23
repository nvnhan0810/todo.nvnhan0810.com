<?php

namespace Modules\Todo\Domain;

final class TodoStatus
{
    public const BACKLOG = 'backlog';

    public const TODO = 'todo';

    public const IN_PROGRESS = 'in_progress';

    public const DONE = 'done';

    public const REJECTED = 'rejected';

    /** @var list<string> */
    public const ALL = [self::BACKLOG, self::TODO, self::IN_PROGRESS, self::DONE, self::REJECTED];

    /** @var list<string> */
    public const ACTIVE = [self::TODO, self::IN_PROGRESS];
}
