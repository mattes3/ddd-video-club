# Product Description: DDD Video Club v2

## Why This Project Exists
The DDD Video Club v2 is an educational sample application designed to illustrate Domain-Driven Design (DDD) principles in a practical, real-world-like scenario. It serves as a teaching tool for the iSAQB Certified Domain-Driven Design Advanced Level course by Matthias Bohlen. The project demonstrates how to apply DDD concepts such as bounded contexts, aggregates, entities, value objects, repositories, application services, and domain events within a modular, hexagonal architecture (ports and adapters). By implementing a simplified video rental system, it provides a tangible example of clean, testable, and maintainable software design that separates domain logic from infrastructure concerns.

## Problems It Solves
- **Complex Domain Modeling**: Traditional monolithic applications often mix business logic with technical details, leading to brittle code. This project solves this by enforcing DDD layers, ensuring domain models remain pure and independent.
- **Inter-Service Communication**: In microservices or modular systems, synchronous coupling can create tight dependencies. The event-driven approach using an event bus addresses this by enabling loose coupling through asynchronous domain events.
- **Pricing and Billing Complexity**: Dynamic pricing with discounts and time-bound campaigns can be error-prone. The project encapsulates these rules in domain services, making them testable and extensible.
- **Educational Gaps in DDD Implementation**: Many DDD resources are theoretical; this project provides a concrete, runnable example in TypeScript/Node.js, bridging the gap between concepts and code.
- **Testability in Layered Architectures**: By using ports and adapters, the project shows how to mock infrastructure (e.g., databases, event buses) for integration testing without affecting domain logic.

## How It Should Work
The application operates as a monorepo with distinct bounded contexts (Movies, Rental, Pricing, Accounting) and infrastructure modules (Database, Event Bus, Reverse Proxy, Frontend).

1. **Movie Browsing and Selection**: Users view a catalog of movies (pre-populated with demo data: Matrix, Notting Hill, Bourne Identity) via the React frontend. Movies are fetched from the Movies service's REST API, which queries the PostgreSQL database through a repository adapter.
   
2. **Renting a Movie**: Selecting "Rent now" opens a dialog to choose rental duration. The Rental service creates a Rental entity, persists it, and publishes a `MOVIE_RENTED` event to the RabbitMQ event bus.

3. **Pricing Calculation**: The Pricing service consumes `MOVIE_RENTED` events, applies relevant discount campaigns (based on movie category and dates) using a domain service (base 350 cents/day, reduced by percentage), and publishes a `MOVIE_RENTAL_PRICED` event with the final price.

4. **Accounting Update**: The Accounting service consumes `MOVIE_RENTAL_PRICED` events, adds a debit entry to the customer's Account aggregate, updates the balance, and persists changes.

5. **Viewing and Account Management**: Users can watch rented movies (YouTube embeds) or view account overviews showing entries and balance. All interactions route through the Caddy reverse proxy to the appropriate microservices.

The system uses Objection.js for ORM, Knex for migrations, and Yarn workspaces for build management. Events ensure eventual consistency without direct service calls.

## User Experience Goals
- **Simplicity and Intuitiveness**: A clean, responsive UI with Tailwind CSS allows quick movie selection, rental, and account checks. No complex forms or authentication (uses dummy customer ID for demo).
- **Immediate Feedback**: Rentals trigger real-time updates to pricing and billing via events, visible in the account view without manual refresh.
- **Educational Transparency**: While functional, the code emphasizes DDD patterns, making it easy for learners to trace business rules from UI to domain models.
- **Reliability**: Local setup via Docker (PostgreSQL, RabbitMQ) and tmuxinator ensures smooth demo runs. Discounts can be manually inserted for testing variability.
- **Extensibility**: Design allows easy addition of features (e.g., new genres, payment integration) without disrupting core logic.

This product prioritizes learning over production readiness, focusing on DDD best practices in a minimal viable application.