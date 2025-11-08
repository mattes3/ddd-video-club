# Project Brief: DDD Video Club v2

## Overview
This project is a sample application developed for Matthias Bohlen's Domain-Driven Design (DDD) Advanced Level course (iSAQB Certified). It implements a simplified video rental system, often referred to as a "poor man's Netflix." The application allows users to browse and select movies, rent them for a specified number of days, watch rented movies in the browser, and view account billing information.

The primary goal is to demonstrate DDD principles, including bounded contexts, aggregates, entities, value objects, repositories, application services, and domain events, alongside the "ports and adapters" (hexagonal) architectural style as described by Alistair Cockburn. The implementation uses TypeScript on Node.js, organized as a monorepo with pnpm workspaces.

## Core Requirements
- **User Journey**:
  - Browse available movies categorized by genre (e.g., Science Fiction, Romance, Action).
  - Select and rent a movie for a chosen duration (in days).
  - View rented movies via embedded video players.
  - Access account overview showing rental history, applied discounts, and billing balance.

- **Business Rules**:
  - Rentals trigger pricing calculations (base rate: 350 cents/day) with support for category-specific discount campaigns (percentage off, time-bound).
  - Event-driven updates: Renting a movie publishes a `MOVIE_RENTED` event, which triggers pricing (`MOVIE_RENTAL_PRICED`) and accounting updates.
  - Accounts track entries (rentals as debits) and maintain a running balance in cents.
  - Demo data includes three movies: Matrix (Science Fiction), Notting Hill (Romance), Bourne Identity (Action).

- **Non-Functional Requirements**:
  - Modular, testable architecture with clear separation of concerns (domain logic independent of infrastructure).
  - Asynchronous communication via event bus for loose coupling between services.
  - RESTful APIs for frontend integration.
  - Responsive UI with Tailwind CSS.

## Scope Boundaries
- **In Scope**: Movie catalog management, rental transactions, dynamic pricing with discounts, basic accounting, simple frontend for interaction.
- **Out of Scope**: User authentication/registration (uses dummy customer ID), advanced search/filtering, payment processing, multi-user concurrency, production scaling, real video hosting (uses YouTube embeds).

## Success Criteria
- Application runs locally with all services (database, event bus, microservices, frontend) starting via tmuxinator or manual commands.
- End-to-end flow: Rent a movie, verify pricing (with/without discount), check account balance.
- Tests pass, including integration tests in pricing module.
- Code adheres to DDD patterns, with pure domain models and infrastructure adapters.

## Key Assumptions
- Single schema (`dddvc`) in PostgreSQL.
- Events are fire-and-forget (no retries or dead-letter queues in current implementation).
- Frontend assumes a fixed user (dummy ID); no real user management.

This brief serves as the source of truth for project scope. Updates should be made manually by the developer if requirements evolve.