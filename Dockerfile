# Base image
FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1

# Dependencies stage
FROM base AS deps
# Install dependencies needed for native modules
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json package-lock.json ./
# Install dependencies
RUN npm ci

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build the application
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
# Install production dependencies only
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm ci --only=production

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 