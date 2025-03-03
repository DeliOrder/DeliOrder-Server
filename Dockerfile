ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

FROM deps AS build

COPY package.json package-lock.json ./
RUN npm ci

RUN npm install -g npm@10.8.1

COPY . .

RUN npm run build

FROM base AS final

ENV NODE_ENV production
USER node

COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

FROM base AS test
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

USER node
COPY . .
RUN npm run test

EXPOSE 8080

CMD ["node", "./dist/bin/www.js"]