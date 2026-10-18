FROM node:25-trixie-slim AS base
RUN npm install -g bun

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache bun install --frozen-lockfile
RUN bun run build


# Movies microservice
FROM base AS movies
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app/packages/movies
# Knex scripts allow database initialization via
# `docker compose exec movies bunx knex migrate:latest`
RUN cp /usr/src/app/packages/database/knexfile.js . && cp -r /usr/src/app/packages/database/knex .
EXPOSE 4000
CMD [ "bun", "run", "dev" ]

# Rental microservice
FROM base AS rental
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app/packages/rental
EXPOSE 4001
CMD [ "bun", "run", "dev" ]

# Pricing microservice
FROM base AS pricing
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app/packages/pricing
CMD [ "bun", "run", "dev" ]

# Accounting microservice
FROM base AS accounting
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app/packages/accounting
EXPOSE 4002
CMD [ "bun", "run", "dev" ]

# Frontend stage
FROM nginx:alpine AS frontend
COPY --from=build /usr/src/app/packages/frontend/build /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
