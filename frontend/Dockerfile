# ─────────────────────────────────────────────────────────────
# Frontend Dockerfile cho Railway.
#
# 2 stage:
#   1. node:20-alpine — chạy npm ci + npm run build → ra `dist/`
#   2. nginx:1.27-alpine — serve dist/ qua HTTP
#
# `${PORT}` được Railway inject lúc runtime; nginx-alpine xử lý
# template `/etc/nginx/templates/*.template` qua envsubst tự động.
#
# `VITE_API_URL` phải set qua Build Args trên Railway (Vite inline
# vào bundle lúc build, không đọc runtime env được).
# ─────────────────────────────────────────────────────────────

# ─── Stage 1: build ───
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─── Stage 2: serve ───
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

# Default entrypoint của nginx-alpine sẽ envsubst template → conf.d và start nginx
