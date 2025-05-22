# Step 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# Step 2: Serve with a lightweight web server
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# No need to copy public folder separately as it's already in the build output

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
