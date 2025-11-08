# Context: DDD Video Club v2

## Current Work Focus
Integrated Docker support with a single root docker-compose.yml for full stack orchestration, multi-stage Dockerfile (including frontend target), and updated documentation. Removed deployment/ directory.

## Recent Changes
- Migrated from Yarn to pnpm: Updated package.json scripts, lockfile, .npmrc, .gitignore, and all documentation references (README.md, memory bank files, index.html).
- Disabled ESLint in frontend React build by adding DISABLE_ESLINT_PLUGIN=true to dev and build scripts in packages/frontend/package.json.
- Updated memory bank files (brief.md, product.md, architecture.md, tech.md) to reference pnpm workspaces and commands consistently.
- Implemented Docker integration: Multi-stage Dockerfile at root for backend services and frontend (nginx static serve with SPA config), single docker-compose.yml at root orchestrating DB (postgres:12, dddvc schema), RabbitMQ, services (movies:4000, rental:4001, pricing, accounting:4002), frontend (target 'frontend'), Caddy proxy (5001). Updated configs for env vars (DATABASE_*, RABBITMQ_*), healthchecks, depends_on. Moved nginx.conf to packages/frontend/nginx.conf. Removed deployment/ directory and dockerize.sh.
- Updated README.md with Docker instructions (up --build -d, migrations, access 5001), local dev options preserved.
- Adapted DB/EventBus connections for Docker (env vars in knexfile.js, EventBusImpl.ts).
- Frontend now static build served via nginx behind Caddy; relative API paths.

## Next Steps
- Verify full Docker stack functionality (build, run, end-to-end flow, migrations).
- Test local dev vs Docker compatibility.
- Proceed with new project tasks, ensuring memory bank reflects Docker as primary deployment method.
