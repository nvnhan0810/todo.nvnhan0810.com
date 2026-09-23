<?php

return [
    'vapid' => [
        'subject' => env('VAPID_SUBJECT', 'mailto:admin@nvnhan0810.com'),
        'public_key' => env('VAPID_PUBLIC_KEY'),
        'private_key' => env('VAPID_PRIVATE_KEY'),
    ],

    'focus_ttl_seconds' => (int) env('WEB_PUSH_FOCUS_TTL_SECONDS', 15),

    'matrix_url' => '/matrix',
];
