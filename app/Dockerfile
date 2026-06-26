FROM node:22 AS builder
# we will be working on the directory app inside this image
WORKDIR /app

# Clean install npm dependencies
COPY package*.json ./
RUN npm ci

# copying sources of host current directory to image current directory
COPY . .
RUN npm run build


FROM node:22-slim

WORKDIR /app

COPY --from=builder app/build ./build
COPY --from=builder app/node_modules ./node_modules
COPY --from=builder app/package*.json ./

# RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "build"]
