FROM node:24-alpine AS reservations-development

WORKDIR /usr/src/app

# Copy necessary files for the build
COPY pnpm-workspace.yaml ./
COPY .npmrc ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Install pnpm globally
RUN npm install -g pnpm
RUN npm install -g @nestjs/cli

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY libs libs
COPY apps/reservations apps/reservations

# Build libraries and the specific app
RUN pnpm run build:common
RUN pnpm run build reservations

EXPOSE 3000

FROM node:24-alpine AS reservations-production

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

# Install pnpm globally
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy the built application from the development stage
COPY --from=reservations-development /usr/src/app/dist ./dist

# Run the application
CMD ["node", "dist/apps/reservations/main.js"]
