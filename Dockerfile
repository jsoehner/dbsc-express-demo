# --- Builder Stage ---
FROM node:26 AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy application files needed for certs/migrations
COPY . .

# Create a data directory and set permissions
RUN mkdir -p data && chown node:node data

# Set the database URL for the build process
ENV DATABASE_URL=./data/db.sqlite

# Generate localhost certs inside the builder
RUN openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365 -subj "/CN=localhost"

# Run migrations to generate the local SQLite database
RUN MIGRATION=1 npx --yes @better-auth/cli migrate -y --config server.js

# --- Runner Stage ---
FROM node:26-slim AS runner

WORKDIR /app

# Install openssl for the runner
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set ownership of the working directory
RUN chown node:node /app

# Create data directory for the runner
RUN mkdir -p data && chown node:node data

# Switch to the non-root user early
USER node

# Copy files from builder with correct ownership
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/server.js ./server.js
COPY --chown=node:node --from=builder /app/server.cert ./server.cert
COPY --chown=node:node --from=builder /app/server.key ./server.key
COPY --chown=node:node --from=builder /app/data/db.sqlite ./data/db.sqlite

# Set the database URL for the runner
ENV DATABASE_URL=./data/db.sqlite

# Expose port 3000
EXPOSE 3000


# Start the application
CMD ["node", "server.js"]
