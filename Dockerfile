FROM node:20-alpine as base

RUN corepack enable

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

ENV NODE_ENV=production

RUN apk install wget gpg coreutils

RUN wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

RUN echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list

RUN apk update && apk add hcp

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