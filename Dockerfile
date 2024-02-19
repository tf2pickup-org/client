FROM node:20-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /build
WORKDIR /build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

ARG branding=tf2pickup.pl
RUN pnpm build:${branding}


FROM nginx:stable-alpine

ARG branding=tf2pickup.pl
ARG apiUrl=api.tf2pickup.pl

ENV CLIENT_BRANDING=${branding}
ENV API_URL=${apiUrl}

COPY --from=build /build/dist/${branding} /usr/share/nginx/html
COPY nginx/templates/default.conf.template /etc/nginx/templates/default.conf.template
