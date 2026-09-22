FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json .sequelizerc sequelize.config.js ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.sequelizerc ./.sequelizerc
COPY --from=builder /app/sequelize.config.js ./sequelize.config.js
COPY src/infrastructure/database/migrations ./src/infrastructure/database/migrations
COPY src/infrastructure/database/seeders ./src/infrastructure/database/seeders
EXPOSE 3333
CMD ["sh", "-c", "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && node dist/main.js"]
