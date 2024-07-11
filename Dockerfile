FROM node:20-alpine as base

LABEL org.opencontainers.image.source=https://github.com/aarontravass/medihacks2024

RUN corepack enable

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

ENV NODE_ENV=production

RUN apk add --update --virtual .deps --no-cache gnupg && \
    cd /tmp && \
    wget https://releases.hashicorp.com/hcp/0.4.0/hcp_0.4.0_linux_amd64.zip && \
    wget https://releases.hashicorp.com/hcp/0.4.0/hcp_0.4.0_SHA256SUMS && \
    wget https://releases.hashicorp.com/hcp/0.4.0/hcp_0.4.0_SHA256SUMS.sig && \
    wget -qO- https://www.hashicorp.com/.well-known/pgp-key.txt | gpg --import && \
    gpg --verify hcp_0.4.0_SHA256SUMS.sig hcp_0.4.0_SHA256SUMS && \
    grep hcp_0.4.0_linux_amd64.zip hcp_0.4.0_SHA256SUMS | sha256sum -c && \
    unzip /tmp/hcp_0.4.0_linux_amd64.zip -d /tmp && \
    mv /tmp/hcp /usr/local/bin/hcp && \
    rm -f /tmp/hcp_0.4.0_linux_amd64.zip hcp_0.4.0_SHA256SUMS 0.4.0/hcp_0.4.0_SHA256SUMS.sig && \
    apk del .deps

WORKDIR /app

COPY . /app/

RUN npm pkg delete scripts.prepare

RUN rm -rf /app/packages/web

RUN pnpm i --prod && pnpm i -r --prod

WORKDIR /app/packages/prisma

RUN pnpm generate

FROM base as api

WORKDIR /app/packages/platform

RUN pnpm build

EXPOSE 3000

CMD [ "pnpm", "start" ]