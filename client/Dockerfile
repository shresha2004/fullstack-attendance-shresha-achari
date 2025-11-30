FROM node:18-alpine AS build

WORKDIR /app

# Install deps
COPY package*.json ./
COPY .env ./
RUN npm install

# Build
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
