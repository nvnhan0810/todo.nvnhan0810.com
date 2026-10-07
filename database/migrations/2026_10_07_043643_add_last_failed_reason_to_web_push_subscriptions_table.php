<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('web_push_subscriptions', function (Blueprint $table) {
            $table->text('last_failed_reason')->nullable()->after('failed_sent');
        });
    }

    public function down(): void
    {
        Schema::table('web_push_subscriptions', function (Blueprint $table) {
            $table->dropColumn('last_failed_reason');
        });
    }
};
