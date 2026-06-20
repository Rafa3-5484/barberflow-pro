FROM node:22-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json backend/prisma.config.ts ./
RUN npm install
COPY backend/prisma ./prisma
RUN npx prisma generate
COPY backend/ ./
RUN npm run build

FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:22-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=backend-builder /app/backend ./backend
COPY --from=frontend-builder /app/frontend ./frontend
COPY package*.json start.js ./
EXPOSE 3000
CMD cd backend && npx prisma migrate deploy && cd .. && node start.js
