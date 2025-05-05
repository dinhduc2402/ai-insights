# Build stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
# RUN npm run build

# Production stage
# FROM node:18-alpine AS production

# WORKDIR /app

# Copy built assets from builder
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]

# --- Add this section for a production build (optional but good practice) ---
# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# # If using yarn:
# # COPY yarn.lock ./
# RUN npm install --only=production --legacy-peer-deps
# # If using yarn:
# # RUN yarn install --production
# COPY . .
# COPY --from=development /app/node_modules ./node_modules # Copy node_modules from dev stage if needed
# RUN npm run build
# # If using yarn:
# # RUN yarn build

# FROM node:18-alpine AS production
# WORKDIR /app
# ENV NODE_ENV production
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

# EXPOSE 3000
# CMD ["node", "server.js"] # Command for standalone output