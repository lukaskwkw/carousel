FROM node:latest as nodelatest
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app
COPY ./ ./
RUN npm ci && \
    npm run build:production

FROM httpd:2.4
COPY ./certs /usr/local/apache2/conf/
RUN sed -i \
    -e 's/^#\(Include .*httpd-ssl.conf\)/\1/' \
    -e 's/^#\(LoadModule .*mod_ssl.so\)/\1/' \
    -e 's/^#\(LoadModule .*mod_socache_shmcb.so\)/\1/' \
    /usr/local/apache2/conf/httpd.conf
COPY --from=nodelatest /usr/src/app/dist /usr/local/apache2/htdocs/