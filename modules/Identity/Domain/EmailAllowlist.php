<?php

namespace Modules\Identity\Domain;

final class EmailAllowlist
{
    /**
     * @param  list<string>  $patterns
     */
    public static function isAllowed(string $email, array $patterns): bool
    {
        $email = strtolower(trim($email));

        if ($patterns === []) {
            return false;
        }

        foreach ($patterns as $pattern) {
            if (self::matchesPattern($email, (string) $pattern)) {
                return true;
            }
        }

        return false;
    }

    private static function matchesPattern(string $email, string $pattern): bool
    {
        $pattern = strtolower(trim($pattern));

        if ($pattern === $email) {
            return true;
        }

        if (str_starts_with($pattern, '*@')) {
            $domain = substr($pattern, 2);

            return $domain !== '' && str_ends_with($email, '@'.$domain);
        }

        return false;
    }
}
