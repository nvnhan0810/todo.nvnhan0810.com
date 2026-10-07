<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('web_push_subscriptions', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('last_focused_at');
            $table->unsignedInteger('failed_sent')->default(0)->after('is_active');
            $table->index(['user_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::table('web_push_subscriptions', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'is_active']);
            $table->dropColumn(['is_active', 'failed_sent']);
        });
    }
};
