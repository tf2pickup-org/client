FROM node:lts as build
WORKDIR /build

COPY package*.json .
RUN npm install

COPY . .

ARG branding=tf2pickup.pl
RUN npm run build:${branding}


FROM nginx:stable-alpine

ARG branding=tf2pickup.pl
ENV CLIENT_BRANDING=${branding}
COPY --from=build /build/dist/${branding} /usr/share/nginx/html
COPY nginx/templates/default.conf.template /etc/nginx/templates/default.conf.template
