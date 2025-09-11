# ---------- Build TS ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Prod deps ----------
FROM node:20-alpine AS proddeps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---------- Runner ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=proddeps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
EXPOSE 4000
CMD ["node", "dist/index.js"]
