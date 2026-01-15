# Multi-stage build for production

# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install pnpm and dependencies (including devDependencies for building)
# Set HUSKY=0 to disable husky in Docker environment
RUN npm install -g pnpm && HUSKY=0 pnpm install

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine AS production

# Update apk cache and install dumb-init for proper signal handling
RUN apk update && apk add dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install pnpm and only production dependencies
# Use --ignore-scripts to disable prepare script (husky is in devDependencies)
RUN npm install -g pnpm && pnpm install --prod --ignore-scripts && pnpm store prune

# Copy build artifacts from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Copy scripts and config
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "./scripts/start.js"]
