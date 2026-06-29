FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files (including the self-signed cert for demo purposes)
COPY --chown=node:node . .

# Run migrations during the image build process so it doesn't need to happen on startup
RUN npx --yes @better-auth/cli migrate -y --config server.js

# Expose port 3000
EXPOSE 3000

# Set non-root user
RUN chown -R node:node /app
USER node

# Start the application
CMD ["npm", "start"]
