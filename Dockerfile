FROM node:lts as build
WORKDIR /build

COPY package*.json .
RUN npm install

COPY . .

ARG CLIENT_BRANDING=tf2pickup.pl
RUN npm run build:${CLIENT_BRANDING}


FROM nginx:stable-alpine

ARG CLIENT_BRANDING=tf2pickup.pl
ENV CLIENT_BRANDING=${CLIENT_BRANDING}
COPY --from=build /build/dist/${CLIENT_BRANDING} /usr/share/nginx/html
COPY nginx/templates/default.conf.template /etc/nginx/templates/default.conf.template
