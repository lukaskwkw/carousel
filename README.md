# Wrepp

Simple boilerplate that include all good stuff - webpack, react, eslint, prettier and pre-hooks

## Prerequisites:

[NodeJS v12.2.0](https://nodejs.org/en/)

## Installation

```sh
npm ci
```

Running development server:

```sh
npm start
```

Open webrowser on [localhost:8080](localhost:8080)

## Building

```sh
npm run build:production
```

Move dist files to your server <br /> <br />

# Docker

### Prerequisites:

[Docker](https://docs.docker.com/install/)

### SSL Encryption

Generating self signed ssl certificates. You can skip this and go streight to deployment section if you whish to proceed whithout encryption

#### Linux

In repository create folder certs

```sh
mkdir certs
openssl genrsa 2048 > certs/server.key
chmod 400 certs/server.key
openssl req -new -x509 -nodes -sha256 -days 365 -key certs/server.key -out certs/server.crt
```

### Deployment

#### One command for build and run

```sh
npm run docker:deploy
```

or for SSL version

```sh
npm run docker:deploy:ssl
```

#### Building

```sh
npm run docker:build
```

or

```sh
npm run docker:build:ssl
```

#### Running

```sh
npm run docker:run
```

or for SSL version

```sh
npm run docker:run:sll
```

Open webrowser on [localhost](http://localhost) or [https://localhost](https://localhost)

## Container management

After docker deployment you can procced with simply these commands

```sh
npm run docker:start
```

```sh
npm run docker:stop
```

```sh
npm run docker:removeContainer
```

# ARMv7L support

It occurs that node-sass package doesn't have compiled armv7l version of its binary so i decided to compile one. In order to get boilerplate fully work with your arm7l architecture just simply checkout to `armv7l` branch and proceed instalation from it.
