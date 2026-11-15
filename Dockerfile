# Production Dockerfile for CampusCart
FROM node:22-alpine

WORKDIR /app

# Copy application files
COPY . .

# Expose server port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Start CampusCart
CMD ["node", "server.js"]
