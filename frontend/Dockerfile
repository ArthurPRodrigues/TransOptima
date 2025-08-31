FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm config set fund false \
 && npm config set audit false \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-factor 2 \
 && npm config set fetch-retry-maxtimeout 600000 \
 && npm set progress=false \
 && (npm ci || npm install)

COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
