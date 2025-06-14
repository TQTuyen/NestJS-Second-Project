FROM node:24-alpine AS payments-development

WORKDIR /usr/src/app

# Copy necessary files for the build
COPY pnpm-workspace.yaml ./
COPY .npmrc ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Copy the specific app's package.json
COPY apps/payments/package.json ./apps/payments/

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY libs libs
COPY apps/payments apps/payments

# Build libraries and the specific app
RUN pnpm run build:common
RUN pnpm run build payments

EXPOSE 3003

FROM node:24-alpine AS payments-production

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
COPY apps/payments/package.json ./apps/payments/

# Install pnpm globally
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy the built application from the development stage
COPY --from=payments-development /usr/src/app/dist ./dist

# Run the application
CMD ["node", "dist/apps/payments/main.js"]
