FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
ENV NODE_ENV=production DATABASE_URL=file:/data/craft.db
RUN npm run build
EXPOSE 3000
CMD ["sh", "scripts/start-prod.sh"]
