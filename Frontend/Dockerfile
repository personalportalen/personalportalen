# ===== BUILD STAGE =====
FROM node:20-alpine AS build
WORKDIR /app

# Kopiera package-filer först (cache-optimering)
COPY package*.json ./

RUN npm install

# Kopiera resten av koden
COPY . .

# Bygg produktion
RUN npm run build


# ===== RUNTIME STAGE =====
FROM nginx:alpine

# Ta bort default config
RUN rm /etc/nginx/conf.d/default.conf

# Kopiera egen nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiera buildade filer
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]