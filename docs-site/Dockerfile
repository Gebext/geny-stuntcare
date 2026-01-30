# Multi-stage Dockerfile: build Docusaurus then serve with nginx

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY docs/ ./docs/
COPY docusaurus.config.js sidebars.js ./
COPY src ./src
RUN npm ci --silent
RUN npm run build

# Production stage - serve static files with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
# Optional: custom nginx config can be copied here
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
