FROM node:25-trixie-slim AS base
RUN npm install -g pnpm

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=@ddd-video-club-v2/movies     --prod /prod/movies
RUN pnpm deploy --filter=@ddd-video-club-v2/rental     --prod /prod/rental
RUN pnpm deploy --filter=@ddd-video-club-v2/pricing    --prod /prod/pricing
RUN pnpm deploy --filter=@ddd-video-club-v2/accounting --prod /prod/accounting

FROM base AS movies
COPY --from=build /prod/movies /prod/movies
WORKDIR /prod/movies
EXPOSE 4000
CMD [ "pnpm", "dev" ]

FROM base AS rental
COPY --from=build /prod/rental /prod/rental
WORKDIR /prod/rental
EXPOSE 4001
CMD [ "pnpm", "dev" ]

FROM base AS pricing
COPY --from=build /prod/pricing /prod/pricing
WORKDIR /prod/pricing
CMD [ "pnpm", "dev" ]

FROM base AS accounting
COPY --from=build /prod/accounting /prod/accounting
WORKDIR /prod/accounting
EXPOSE 4002
CMD [ "pnpm", "dev" ]
