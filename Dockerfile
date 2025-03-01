# Node.js 기반 이미지 설정
ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

################################################################################
# Install dependencies (without dev dependencies)
FROM base AS deps

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

################################################################################
# Build the application
FROM deps AS build

# Install dev dependencies (separately from global packages)
COPY package.json package-lock.json ./
RUN npm ci

# Install global npm separately
RUN npm install -g npm@10.8.1

# Copy application source
COPY . .

# Build the application (dist 폴더 생성)
RUN npm run build

################################################################################
# Create a new stage for production execution
FROM base AS final

ENV NODE_ENV production
USER node

# Copy necessary files from previous stages
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Expose port
EXPOSE 8080

# Start application
CMD ["node", "./dist/bin/www.js"]