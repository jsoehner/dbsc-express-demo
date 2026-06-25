FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files (including the self-signed cert for demo purposes)
COPY . .

# Expose port 3000
EXPOSE 3000

# Set non-root user
USER node

# Start the application
CMD ["npm", "start"]
