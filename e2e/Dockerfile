FROM node:24-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

CMD ["pnpm", "test"]

