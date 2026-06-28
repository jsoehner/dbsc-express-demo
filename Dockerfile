FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files (including the self-signed cert for demo purposes)
COPY --chown=node:node . .

# Expose port 3000
EXPOSE 3000

# Set non-root user
RUN chown -R node:node /app
USER node

# Start the application
CMD ["npm", "start"]
