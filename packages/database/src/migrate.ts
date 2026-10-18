// Applies or reverts the plain SQL migrations in ../migrations.
//
//   bun src/migrate.ts up [count]     apply all pending migrations (or the next <count>)
//   bun src/migrate.ts down [count]   revert the latest migration (or the latest <count>)
//
// Each migration consists of <name>.up.sql and <name>.down.sql and runs in one transaction.
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { createSql } from './initPersistence';

const migrationsDir = join(__dirname, '..', 'migrations');

const [direction, countArg] = process.argv.slice(2);
if (direction !== 'up' && direction !== 'down') {
    console.error('Usage: bun src/migrate.ts up|down [count]');
    process.exit(1);
}

async function main() {
    const sql = createSql();

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS public.schema_migrations (
                name text PRIMARY KEY,
                applied_at timestamptz NOT NULL DEFAULT now()
            )
        `;

        const names = (await readdir(migrationsDir))
            .filter((file) => file.endsWith('.up.sql'))
            .map((file) => file.replace(/\.up\.sql$/, ''))
            .sort();
        const applied = new Set(
            (await sql`SELECT name FROM public.schema_migrations`).map(
                (row: { name: string }) => row.name,
            ),
        );

        const count = countArg ? parseInt(countArg) : direction === 'up' ? Infinity : 1;
        const todo =
            direction === 'up'
                ? names.filter((name) => !applied.has(name)).slice(0, count)
                : names
                      .filter((name) => applied.has(name))
                      .reverse()
                      .slice(0, count);

        for (const name of todo) {
            const text = await Bun.file(join(migrationsDir, `${name}.${direction}.sql`)).text();
            await sql.begin(async (tx) => {
                await tx.unsafe(text);
                if (direction === 'up') {
                    await tx`INSERT INTO public.schema_migrations (name) VALUES (${name})`;
                } else {
                    await tx`DELETE FROM public.schema_migrations WHERE name = ${name}`;
                }
            });
            console.log(`${direction}: ${name}`);
        }
        if (todo.length === 0) {
            console.log('Nothing to do.');
        }
    } finally {
        await sql.close();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
