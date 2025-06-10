FROM node:24-alpine AS development

RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:24-alpine AS production

EXPOSE 3001

RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]