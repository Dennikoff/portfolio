# --- Stage 1: build static site ---
FROM node:20-alpine AS build
WORKDIR /app

# Install deps (cached until package*.json changes)
COPY package.json package-lock.json* ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# --- Stage 2: serve with nginx ---
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Базовый образ nginx кладёт в раздачу свои index.html и 50x.html, а COPY только
# доливает файлы сверху и чужие не удаляет. Чистим папку явно — чтобы в раздаче
# осталось ровно то, что собрал Astro, и ни одного файла из прошлых сборок.
RUN rm -rf /usr/share/nginx/html/* /usr/share/nginx/html/.[!.]*
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
