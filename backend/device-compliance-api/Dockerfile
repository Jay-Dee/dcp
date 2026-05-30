FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci


FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

COPY --from=dependencies /app/node_modules ./node_modules

RUN npm run build


FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]