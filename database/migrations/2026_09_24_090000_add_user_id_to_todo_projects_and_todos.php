<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('todo_projects', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
        });

        Schema::table('todos', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
        });

        $ownerId = $this->resolveBackfillUserId();

        if ($ownerId !== null) {
            DB::table('todo_projects')->whereNull('user_id')->update(['user_id' => $ownerId]);
            DB::table('todos')->whereNull('user_id')->update(['user_id' => $ownerId]);
        }

        // Reject orphan rows if somehow no owner exists (empty users table).
        if (DB::table('todo_projects')->whereNull('user_id')->exists()
            || DB::table('todos')->whereNull('user_id')->exists()) {
            throw new RuntimeException(
                'Cannot add NOT NULL user_id: orphan todos/projects exist and no users to own them.',
            );
        }

        Schema::table('todo_projects', function (Blueprint $table) {
            $table->dropUnique(['git_repo_url']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->unique(['user_id', 'git_repo_url']);
        });

        Schema::table('todos', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->index('user_id');
        });

        DB::statement('ALTER TABLE todo_projects ALTER COLUMN user_id SET NOT NULL');
        DB::statement('ALTER TABLE todos ALTER COLUMN user_id SET NOT NULL');
    }

    public function down(): void
    {
        Schema::table('todo_projects', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'git_repo_url']);
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->unique('git_repo_url');
        });

        Schema::table('todos', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });
    }

    private function resolveBackfillUserId(): ?int
    {
        $preferred = DB::table('users')
            ->where('email', 'nguyenvannhan0810@gmail.com')
            ->value('id');

        if (is_numeric($preferred)) {
            return (int) $preferred;
        }

        $first = DB::table('users')->orderBy('id')->value('id');

        return is_numeric($first) ? (int) $first : null;
    }
};
