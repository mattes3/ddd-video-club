# Database

Keeps a Docker compose file that runs our PostgreSQL database locally,
the connection code (Bun's built-in `SQL` client) and the SQL migrations.

## Migrations

Plain SQL files in `migrations/`, each with an `.up.sql` and a `.down.sql`:

```sh
bun run migrate:up        # apply all pending migrations
bun run migrate:down      # revert the latest migration (or: bun src/migrate.ts down 3)
```

Applied migrations are tracked in `public.schema_migrations`.
