<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebPushSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'endpoint',
        'endpoint_hash',
        'public_key',
        'auth_token',
        'content_encoding',
        'user_agent',
        'last_focused_at',
        'is_active',
        'failed_sent',
        'last_failed_reason',
    ];

    protected function casts(): array
    {
        return [
            'last_focused_at' => 'datetime',
            'is_active' => 'boolean',
            'failed_sent' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
