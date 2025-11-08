# ddd-video-club

![Screenshot of the frontend](./docs/screenshot.png)

Sample for [Matthias Bohlen](https://mbohlen.de)'s
[Domain-Driven Design class](https://mbohlen.de/domain-driven-design-cpsa-a/)
(iSAQB Advanced Level).

It is a small application to rent movies for a few days, watch them inside a
browser, and be billed for this.

Kind of "poor man's Netflix".

It demonstrates how to design such a thing using DDD, and how to implement it in TypeScript
on NodeJS, using the principles of the "ports and adapters" architectural style, as described by
Alistair Cockburn.

## What the Application Does

This is a sample application developed for Matthias Bohlen's Domain-Driven Design (DDD) Advanced Level course (iSAQB Certified). It implements a simplified video rental system where users can:

- Browse and select from available movies
- Rent movies for a specified number of days
- Watch rented movies directly in the browser
- View their account billing information

The application demonstrates DDD principles and the "ports and adapters" (hexagonal) architectural style using TypeScript on Node.js.

Key features include:

- Movie catalog with categories (e.g., Science Fiction, Romance)
- Rental management with duration tracking
- Pricing calculations with support for discount campaigns
- Account billing and overview
- Event-driven architecture for inter-service communication

## How It's Structured

The project is organized as a monorepo using pnpm workspaces, with packages divided into conceptual modules (business domains) and technological modules (infrastructure):

Conceptual Modules (Business Logic)

- Movies: Manages movie catalog and metadata
- Rental: Handles movie rental transactions and publishes domain events
- Pricing: Calculates rental prices and applies discount campaigns
- Accounting: Tracks customer accounts and billing

Technological Modules (Infrastructure)

- Database: PostgreSQL with Knex migrations and Objection.js ORM
- Event Bus: RabbitMQ for asynchronous inter-service communication
- Reverse Proxy: Caddy server for API routing
- Frontend: React application with Tailwind CSS

Architecture Pattern

Each conceptual module follows DDD layered architecture with ports and adapters:

- Domain Model: Pure TypeScript types/entities (e.g., Movie, Rental)
- Application Service: Business logic orchestration (e.g., MovieAppService, RentalAppService)
- Repository Interface: Data access abstraction

Adapters:

- HTTP: Express.js REST APIs
- Persistence: Database implementations using Objection.js

Services communicate via domain events published to the event bus (e.g., MOVIE_RENTED event triggers pricing and accounting updates).


## Packages in the `packages` directory

The app consists of the following conceptual modules:

- Movies (using NodeJS)
- Rental (using NodeJS)
- Pricing (using NodeJS)
- Accounting (using NodeJS)

Additionally, there are 3 technological modules:

- Database (using PostgreSQL)
- Event Bus (using RabbitMQ)
- Reverse Proxy (using Caddy Server)

Finally, there is a frontend using React and Tailwind.

![Application architecture](./docs/application-architecture.png)

## How to build

Install Node. Then go to the root folder of this project and type

```
corepack enable
pnpm install
pnpm build
```

This compiles all TypeScript packages and builds the frontend static assets.

## How to run

### Using Docker (Recommended for full stack)

The project now uses a single docker-compose.yml at the root to orchestrate the entire stack, including PostgreSQL, RabbitMQ, the four backend services (movies, rental, pricing, accounting), the static frontend (nginx), and Caddy reverse proxy.

1. Ensure Docker is running.

2. Start the full stack:
   ```
   docker compose up -d
   ```
3. Run migrations (only on initial setup):
   ```
   docker compose exec movies pnpm knex migrate:latest
   ```
   inside the movies service container after full start.

4. Access the application at http://localhost:5001.

5. View logs: `docker compose logs -f [service]`

6. Stop: `docker compose down`

The Dockerfile in `deployment` provides multi-stage builds for backend services and frontend (target 'frontend' for nginx static serve).

### Local Development (Without Docker)

For local development without Docker:

#### Start the database and initialize the schema

```
cd packages/database
docker-compose up -d
sleep 30
pnpm knex migrate:latest
```

#### Start the event bus

```
cd packages/event-bus
docker-compose up -d
```

#### Start the API servers

1. `cd packages/movies && pnpm dev` (port 4000)

2. `cd packages/rental && pnpm dev` (port 4001)

3. `cd packages/pricing && pnpm dev` (no HTTP port)

4. `cd packages/accounting && pnpm dev` (port 4002)

#### Start the reverse proxy

Install Caddy: `brew install caddy` (macOS).

```
cd packages/reverse-proxy
caddy run
```

(port 5001)

#### Start the frontend

```
cd packages/frontend
pnpm dev
```

(http://localhost:3000, proxies to 5001)

### Demo Usage

Browse movies at http://localhost:5001, rent one (e.g., Matrix for 5 days), view account at /account. To test discounts, insert into discount_campaigns table via psql.

## Run Integration Test in Pricing

```
cd packages/pricing
pnpm test
```

(q to quit)

