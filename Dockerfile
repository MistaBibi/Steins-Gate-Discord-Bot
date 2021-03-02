FROM node:lts-alpine as build

RUN apk add --no-cache \
    autoconf \
    automake \
    build-base \
    git \
    libtool \
    python3

WORKDIR /root/package

COPY package.json package-lock.json ./
RUN npm ci --production

FROM node:lts-alpine

RUN apk add --no-cache ffmpeg

ADD steins-gate-discord-bot-*.tgz /home/node
WORKDIR /home/node/package
RUN chown -R node:node .
COPY --from=build --chown=node:node /root/package .

USER node

ENTRYPOINT ["node", "."]

ARG GITHUB_SERVER_URL
ARG GITHUB_REPOSITORY
LABEL org.opencontainers.image.source ${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}
