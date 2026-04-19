FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts
COPY . .
RUN NODE_OPTIONS=--max-old-space-size=4096 npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=build /app/.output /app
EXPOSE 3000/tcp
ENTRYPOINT [ "node", "/app/server/index.mjs" ]
