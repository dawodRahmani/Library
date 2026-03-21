<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite doesn't support ALTER CHECK constraints, so we recreate the table
        DB::transaction(function () {
            DB::statement('CREATE TABLE ledger_entries_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE NOT NULL,
                type VARCHAR CHECK(type IN (\'income\', \'expense\', \'salary\', \'inventory_purchase\', \'fund\')) NOT NULL,
                reference VARCHAR NOT NULL,
                description VARCHAR NOT NULL,
                amount INTEGER UNSIGNED NOT NULL,
                direction VARCHAR CHECK(direction IN (\'in\', \'out\')) NOT NULL,
                category VARCHAR,
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            )');

            DB::statement('INSERT INTO ledger_entries_new SELECT * FROM ledger_entries');
            DB::statement('DROP TABLE ledger_entries');
            DB::statement('ALTER TABLE ledger_entries_new RENAME TO ledger_entries');
        });
    }

    public function down(): void
    {
        DB::transaction(function () {
            DB::statement('DELETE FROM ledger_entries WHERE type = \'fund\'');

            DB::statement('CREATE TABLE ledger_entries_old (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE NOT NULL,
                type VARCHAR CHECK(type IN (\'income\', \'expense\', \'salary\', \'inventory_purchase\')) NOT NULL,
                reference VARCHAR NOT NULL,
                description VARCHAR NOT NULL,
                amount INTEGER UNSIGNED NOT NULL,
                direction VARCHAR CHECK(direction IN (\'in\', \'out\')) NOT NULL,
                category VARCHAR,
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            )');

            DB::statement('INSERT INTO ledger_entries_old SELECT * FROM ledger_entries');
            DB::statement('DROP TABLE ledger_entries');
            DB::statement('ALTER TABLE ledger_entries_old RENAME TO ledger_entries');
        });
    }
};
