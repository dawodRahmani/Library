<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite does not support modifying columns, so we recreate the table
        // with role as a plain string (no CHECK constraint).
        DB::statement('PRAGMA foreign_keys = OFF');

        DB::statement('
            CREATE TABLE employees_new (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name        VARCHAR NOT NULL,
                role        VARCHAR NOT NULL DEFAULT \'waiter\',
                phone       VARCHAR,
                hire_date   DATE,
                is_active   TINYINT(1) NOT NULL DEFAULT 1,
                base_salary INTEGER UNSIGNED NOT NULL DEFAULT 0,
                created_at  DATETIME,
                updated_at  DATETIME
            )
        ');

        DB::statement('INSERT INTO employees_new SELECT * FROM employees');
        DB::statement('DROP TABLE employees');
        DB::statement('ALTER TABLE employees_new RENAME TO employees');

        DB::statement('PRAGMA foreign_keys = ON');
    }

    public function down(): void
    {
        // No rollback — reverting to enum would reject existing free-text roles
    }
};
