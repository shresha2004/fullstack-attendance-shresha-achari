FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./
RUN npm install

# Copy environment file
COPY .env ./

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "app.js"]
