FROM node:20-slim

# Install LibreOffice + Ghostscript
RUN apt-get update && apt-get install -y \
    libreoffice \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
