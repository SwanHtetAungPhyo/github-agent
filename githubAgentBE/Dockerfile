# Build stage
FROM node:20-alpine AS builder

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Set environment variables to prevent platform issues
ENV npm_config_arch=x64
ENV npm_config_platform=linux

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:20-alpine AS production

RUN apk add --no-cache \
    postgresql-client \
    curl

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY src ./src
COPY .env.local .env.local
COPY scripts ./scripts

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["pnpm", "start"]