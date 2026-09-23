<?php

namespace Modules\Todo\Domain;

final class TodoPriority
{
    public const LOW = 'low';

    public const MEDIUM = 'medium';

    public const HIGH = 'high';

    public const URGENT = 'urgent';

    /** @var list<string> */
    public const ALL = [self::LOW, self::MEDIUM, self::HIGH, self::URGENT];
}
