FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm config set fund false \
 && npm config set audit false \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-factor 2 \
 && npm config set fetch-retry-maxtimeout 600000 \
 && npm set progress=false \
 && (npm ci --omit=dev || npm install --omit=dev)

COPY src ./src
RUN mkdir -p /app/uploads
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "src/server.js"]
