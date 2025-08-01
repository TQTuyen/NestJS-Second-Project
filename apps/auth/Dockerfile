FROM node:24-alpine AS auth-development

# Install necessary build tools
RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

WORKDIR /usr/src/app

# Copy necessary files for the build
COPY pnpm-workspace.yaml ./
COPY .npmrc ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Copy prisma schema and migrations
COPY apps/auth/prisma ./prisma

# Copy the specific app's package.json
COPY apps/auth/package.json ./apps/auth/

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Generate Prisma client code
RUN pnpm prisma generate

# Copy the rest of the application code
COPY libs libs
COPY apps/auth apps/auth

# Build libraries and the specific app
RUN pnpm run build:common
RUN pnpm run build auth

EXPOSE 3001

FROM node:24-alpine AS auth-production

# Install necessary build tools
RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

# Set the environment variable for production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy necessary files for the production build
COPY pnpm-workspace.yaml ./
COPY .npmrc ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Copy prisma schema and migrations
COPY apps/auth/prisma ./prisma

# Copy the specific app's package.json
COPY apps/auth/package.json ./apps/auth/

# Install pnpm globally
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Generate Prisma client code
RUN pnpm prisma generate

# Copy the built application from the development stage
COPY --from=auth-development /usr/src/app/dist ./dist

# Copy proto files and relevant proto files
COPY proto proto

# Run the application
CMD ["pnpm", "run", "start:prod", "dist/apps/auth/main.js"]