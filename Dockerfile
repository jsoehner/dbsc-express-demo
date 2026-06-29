# --- Builder Stage ---
FROM node:24-alpine AS builder

WORKDIR /app

# Install openssl for cert generation
RUN apk add --no-cache openssl

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy application files needed for certs/migrations
COPY . .

# Generate localhost certs inside the builder
RUN openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365 -subj "/CN=localhost"

# Run migrations to generate the local SQLite database
RUN MIGRATION=1 npx --yes @better-auth/cli migrate -y --config server.js

# --- Runner Stage ---
FROM node:24-alpine AS runner

WORKDIR /app

# Set ownership of the working directory
RUN chown node:node /app

# Switch to the non-root user early
USER node

# Copy files from builder with correct ownership
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/server.js ./
COPY --chown=node:node --from=builder /app/server.cert ./
COPY --chown=node:node --from=builder /app/server.key ./
COPY --chown=node:node --from=builder /app/db.sqlite ./

# Expose port 3000
EXPOSE 3000


# Start the application
CMD ["npm", "start"]
