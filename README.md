# NestJS Hotel Booking System (Sleepr)

A modern, scalable hotel booking platform built with NestJS, featuring microservices architecture, payment processing, email notifications, and JWT authentication.

## 🏗️ Architecture

This project uses a microservices architecture with the following services:

- **Reservations Service** - Handles hotel booking operations
- **Payments Service** - Processes payments via Stripe
- **Notifications Service** - Sends email notifications
- **Auth Service** - User authentication and authorization

## 🚀 Features

- ✅ Microservices architecture with NestJS
- ✅ JWT Authentication & Authorization
- ✅ Stripe payment integration
- ✅ Beautiful HTML email templates
- ✅ MongoDB with Mongoose ODM
- ✅ Docker containerization
- ✅ Input validation with class-validator
- ✅ Logging with Pino
- ✅ Environment configuration
- ✅ API documentation ready

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **MongoDB** (or use Docker)
- **Stripe Account** (for payments)
- **Gmail Account** (for email notifications)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NestJS-Second-Project
```

### 2. Install Dependencies

```bash
# Install dependencies
npm install

# Or with pnpm
pnpm install
```

### 3. Environment Configuration

Create environment files for each service:

#### `.env` (Root)

```env
# Database
MONGODB_URI=mongodb://mongo:27017/sleepr

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=3600

# Services URLs
AUTH_SERVICE_URL=http://auth:3001
PAYMENTS_SERVICE_URL=http://payments:3002
NOTIFICATIONS_SERVICE_URL=http://notifications:3003
```

#### `apps/reservations/.env`

```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/sleepr
JWT_SECRET=your-super-secret-jwt-key
AUTH_SERVICE_URL=http://auth:3001
PAYMENTS_SERVICE_URL=http://payments:3002
```

#### `apps/auth/.env`

```env
PORT=3001
MONGODB_URI=mongodb://mongo:27017/sleepr
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=3600
```

#### `apps/payments/.env`

```env
PORT=3002
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NOTIFICATIONS_SERVICE_URL=http://notifications:3003
```

#### `apps/notifications/.env`

```env
PORT=3003
SMTP_USER=your-email@gmail.com
GOOGLE_OAUTH_CLIENT_ID=your-google-oauth-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_OAUTH_REFRESH_TOKEN=your-google-oauth-refresh-token
```

### 4. Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your test API keys from the Stripe dashboard
3. Add the secret key to your payments service environment

### 5. Gmail OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Generate refresh token using OAuth playground
7. Add credentials to notifications service environment

## 🐳 Running with Docker

### Development Mode

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services

```bash
# Start only database
docker-compose up mongo

# Start specific service
docker-compose up reservations
```

## 💻 Running Locally

### Start MongoDB

```bash
# With Docker
docker run -d -p 27017:27017 --name mongo mongo:latest

# Or install MongoDB locally
```

### Start Services

```bash
# Terminal 1 - Reservations Service
npm run start:dev reservations

# Terminal 2 - Auth Service
npm run start:dev auth

# Terminal 3 - Payments Service
npm run start:dev payments

# Terminal 4 - Notifications Service
npm run start:dev notifications
```

## 📚 API Documentation

### Authentication Endpoints

```bash
# Register new user
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Login
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Reservations Endpoints

```bash
# Create reservation (requires authentication)
POST http://localhost:3000/reservations
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "startDate": "2025-07-01T00:00:00.000Z",
  "endDate": "2025-07-05T00:00:00.000Z",
  "placeId": "hotel-123",
  "charge": {
    "card": {
      "token": "tok_visa"
    },
    "amount": 200
  }
}

# Get all reservations
GET http://localhost:3000/reservations
Authorization: Bearer <jwt-token>

# Get reservation by ID
GET http://localhost:3000/reservations/:id
Authorization: Bearer <jwt-token>
```

## 🧪 Testing

### Test with Stripe Test Cards

Use these test tokens for payment testing:

- `tok_visa` - Visa card
- `tok_mastercard` - Mastercard
- `tok_amex` - American Express

### Example Test Request

```bash
curl -X POST http://localhost:3000/reservations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-07-01T00:00:00.000Z",
    "endDate": "2025-07-05T00:00:00.000Z",
    "placeId": "hotel-paris-001",
    "charge": {
      "card": {
        "token": "tok_visa"
      },
      "amount": 299
    }
  }'
```

## 📁 Project Structure

```
├── apps/
│   ├── reservations/          # Main booking service
│   │   ├── src/
│   │   │   ├── reservations.controller.ts
│   │   │   ├── reservations.service.ts
│   │   │   └── reservations.module.ts
│   │   └── Dockerfile
│   ├── auth/                  # Authentication service
│   │   ├── src/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── users/
│   │   └── Dockerfile
│   ├── payments/              # Payment processing
│   │   ├── src/
│   │   │   ├── payments.controller.ts
│   │   │   └── payments.service.ts
│   │   └── Dockerfile
│   └── notifications/         # Email notifications
│       ├── src/
│       │   ├── notifications.controller.ts
│       │   └── notifications.service.ts
│       └── Dockerfile
├── libs/
│   └── common/               # Shared utilities
│       ├── src/
│       │   ├── auth/         # JWT guards
│       │   ├── database/     # MongoDB connection
│       │   └── dto/          # Data transfer objects
├── docker-compose.yml
└── README.md
```

## 🔧 Development

### Adding New Features

1. **Create new service:**

```bash
nest generate app new-service
```

2. **Add to docker-compose.yml:**

```yaml
new-service:
  build:
    context: .
    dockerfile: ./apps/new-service/Dockerfile
  ports:
    - '3004:3004'
```

3. **Update communication between services using ClientProxy**

### Database Schema

The project uses MongoDB with Mongoose schemas:

- **Users**: Authentication and user data
- **Reservations**: Hotel booking information
- **Payment Records**: Transaction history

## 🚦 Health Checks

Each service exposes health check endpoints:

```bash
GET http://localhost:3000/health    # Reservations
GET http://localhost:3001/health    # Auth
GET http://localhost:3002/health    # Payments
GET http://localhost:3003/health    # Notifications
```

## 📝 Logging

The application uses Pino for structured logging:

- Request/Response logging
- Error tracking
- Performance monitoring
- Service communication logs

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting ready
- Environment variable protection

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**

```bash
# Check if MongoDB is running
docker-compose ps mongo

# Restart MongoDB
docker-compose restart mongo
```

**2. Payment Processing Fails**

- Verify Stripe API keys are correct
- Check if using test tokens like `tok_visa`
- Ensure payments service is running

**3. Email Not Sending**

- Verify Gmail OAuth credentials
- Check refresh token validity
- Ensure notifications service is running

**4. Service Communication Issues**

- Check if all services are running
- Verify service URLs in environment files
- Check Docker network connectivity

### Debug Mode

```bash
# Run with debug logging
DEBUG=* npm run start:dev reservations

# Docker debug
docker-compose up --build | grep ERROR
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review the logs for error details

---

**Happy Coding! 🚀**
