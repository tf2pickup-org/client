FROM node:lts as build
WORKDIR /build

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases .yarn/releases
RUN yarn install

COPY . .

ARG branding=tf2pickup.pl
RUN yarn build:${branding}


FROM nginx:stable-alpine

ARG branding=tf2pickup.pl
ARG apiUrl=api.tf2pickup.pl

ENV CLIENT_BRANDING=${branding}
ENV API_URL=${apiUrl}

COPY --from=build /build/dist/${branding} /usr/share/nginx/html
COPY nginx/templates/default.conf.template /etc/nginx/templates/default.conf.template
