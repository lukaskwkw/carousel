FROM node:latest as nodelatest
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app
COPY ./ ./
RUN npm ci && \
    npm run build:production

FROM httpd:2.4
COPY --from=nodelatest /usr/src/app/dist /usr/local/apache2/htdocs/