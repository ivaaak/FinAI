FROM node:22-slim AS build
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci --omit=optional
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /usr/app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
# node-llama-cpp is optional and large; it's left out of the image, so /api/llm returns 503.
# Drop --omit=optional (and mount a models/ volume) to run the local model in the container.
RUN npm ci --omit=dev --omit=optional
COPY --from=build /usr/app/dist ./dist
EXPOSE 3000
# Pass ANTHROPIC_API_KEY at runtime, e.g. `docker run -e ANTHROPIC_API_KEY=... -p 3000:3000 finai-api`
CMD ["node", "dist/server.js"]
