# Tech Stack: DDD Video Club v2

## Technologies Used
- **Languages**: TypeScript (primary for domain models, services, and adapters), JavaScript (for Knex migrations and utils).
- **Backend Framework**: Node.js with Express.js for HTTP APIs in each service (Movies, Rental, Pricing, Accounting).
- **Database & ORM**: PostgreSQL (schema: `dddvc`) with Objection.js (ORM) for entity persistence and Knex.js for migrations and schema management.
- **Event Bus**: RabbitMQ for asynchronous messaging, implemented with amqplib library.
- **Frontend**: React (with hooks and TypeScript), Tailwind CSS for styling, Headless UI for components (e.g., Disclosure, Menu, Dialog), React Router for navigation, TanStack Query (React Query) for data fetching/caching, Axios for HTTP requests, React Calendar for date selection.
- **Build & Linting**: Yarn (v3.6.4) workspaces for monorepo management, TypeScript (<5.2.0) for compilation, ESLint (v9) and Prettier (v2.7.1) for code quality.
- **Testing**: Vitest (v0.34.6) for unit and integration tests (e.g., in Pricing package).
- **Utilities**: UUID for IDs, serialize-error for logging, compression, cors, morgan, cookie-parser, nocache for Express middleware.
- **Proxy & Orchestration**: Caddy server for reverse proxy routing, tmuxinator for multi-process startup (DB, Event Bus, services, frontend).

## Development Setup
1. **Prerequisites**: Node.js (with corepack enabled), Yarn, Docker (for PostgreSQL and RabbitMQ), Caddy (via Homebrew on macOS), tmuxinator.
2. **Installation**: Run `yarn` in root to install dependencies across workspaces.
3. **Build**: `yarn build` compiles all packages (TypeScript to dist/).
4. **Database Setup**: `cd packages/database && docker-compose up -d && sleep 30 && yarn knex migrate:latest` (creates schema, tables, demo data).
5. **Event Bus**: `cd packages/event-bus && docker-compose up -d`.
6. **Services**: Run each with `yarn dev` (e.g., `cd packages/movies && yarn dev` on port 4000; similar for Rental:4001, Accounting:4002; Pricing has no HTTP port).
7. **Proxy**: `cd packages/reverse-proxy && caddy run`.
8. **Frontend**: `cd packages/frontend && yarn dev` (runs on http://localhost:3000).
9. **Automated Start**: `tmuxinator start` launches all via .tmuxinator.yml.
10. **Testing**: e.g., `cd packages/pricing && yarn test` for integration tests.

## Technical Constraints
- **Environment**: Local development only; no cloud deployment configured. Assumes macOS (Homebrew for Caddy) and zsh shell.
- **Database**: Single shared schema (`dddvc`) couples contexts (not ideal for production; consider separate DBs per bounded context).
- **Events**: Fire-and-forget with no retries, dead-letter queues, or durability guarantees; acknowledgments always sent (even on errors).
- **Authentication**: None; uses fixed dummy customer ID (`11111111-1111-1111-1111-111111111111`).
- **Data**: Demo-only (3 movies, no real videos; YouTube embeds). No concurrency handling or validation beyond basics.
- **Performance/Scaling**: Not optimized; single-instance services, no caching, shared DB may bottleneck.
- **TypeScript**: Strict mode enforced, but versions pinned (<5.2.0) for compatibility.
- **Frontend**: Assumes modern browsers; no SSR or advanced state management (e.g., Redux).
- **Dependencies**: Workspace-linked packages (e.g., `@ddd-video-club-v2/database`); updates require `yarn` rebuild.

This stack emphasizes DDD education, modularity, and testability over production robustness.