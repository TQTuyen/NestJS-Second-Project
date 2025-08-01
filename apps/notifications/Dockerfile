FROM node:24-alpine AS notifications-development

WORKDIR /usr/src/app

# Copy necessary files for the build
COPY pnpm-workspace.yaml ./
COPY .npmrc ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Copy the specific app's package.json
COPY apps/notifications/package.json ./apps/notifications/

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY libs libs
COPY apps/notifications apps/notifications

# Build libraries and the specific app
RUN pnpm run build:common
RUN pnpm run build notifications

EXPOSE 3004

FROM node:24-alpine AS notifications-production

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

# Copy the specific app's package.json
COPY apps/notifications/package.json ./apps/notifications/

# Install pnpm globally
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy the built application from the development stage
COPY --from=notifications-development /usr/src/app/dist ./dist

# Run the application
CMD ["node", "dist/apps/notifications/main.js"]
