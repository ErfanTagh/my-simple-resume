# Debian-based image: Rollup/Vite optional native bindings are reliable on glibc
# (Alpine/musl often misses @rollup/rollup-linux-*-musl in bind-mounted node_modules).
FROM node:20-bookworm-slim

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install && \
    npm cache clean --force

# Expose the dev server port
EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
