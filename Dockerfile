FROM node:22-alpine

WORKDIR /app

# Install openssl for cert generation
RUN apk add --no-cache openssl

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files (including the self-signed cert for demo purposes)
COPY --chown=node:node . .

# Generate localhost certs inside the image
RUN openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365 -subj "/CN=localhost"

# Run migrations during the image build process so it doesn't need to happen on startup
RUN MIGRATION=1 npx --yes @better-auth/cli migrate -y --config server.js

# Expose port 3000
EXPOSE 3000

# Set non-root user
RUN chown -R node:node /app
USER node

# Start the application
CMD ["npm", "start"]
