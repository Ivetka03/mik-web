FROM node:22-alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/data ./data
COPY --from=build /app/server ./server

ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "server/index.mjs"]
