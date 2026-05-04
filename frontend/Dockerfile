# Stage 1: Build
FROM node:18-slim AS build
WORKDIR /app

# Install dependencies first (better caching)
RUN npm init -y && npm install react react-dom react-scripts

# Copy the folders we just created
COPY public/ ./public/
COPY src/ ./src/

# Run the build
RUN npx react-scripts build

# Stage 2: Production Server
FROM nginx:alpine
# React puts the final files in the /build folder
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]