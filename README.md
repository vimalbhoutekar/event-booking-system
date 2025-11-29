# 🎫 Event Booking System with Concurrency Handling

A production-ready event booking system built with NestJS, featuring **optimistic locking** to handle concurrent bookings and prevent race conditions under high traffic.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Key Implementation Details](#-key-implementation-details)
- [Documentation](#-documentation)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Core Functionality
- 🎪 **Event Management** - Create, update, and delete events
- 🎟️ **Seat Booking** - Book available seats with real-time availability
- 🔒 **Optimistic Locking** - Prevents double booking under high concurrency
- 🔄 **Automatic Retry Logic** - Handles concurrent booking conflicts gracefully
- ❌ **Booking Cancellation** - Cancel bookings and automatically release seats
- 👥 **Role-Based Access** - USER and ORGANIZER roles with proper authorization

### Technical Features
- 🔐 **JWT Authentication** - Secure token-based authentication
- 📧 **OTP Verification** - Email-based OTP for registration
- 🛡️ **Type Safety** - Full TypeScript with Prisma-generated types
- 📚 **Swagger Documentation** - Interactive API documentation
- ✅ **Input Validation** - Request validation using class-validator
- 🔍 **Database Indexing** - Optimized queries for performance

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** | Backend framework with TypeScript |
| **PostgreSQL** | Relational database |
| **Prisma** | Type-safe ORM |
| **JWT** | Authentication tokens |
| **class-validator** | Request validation |
| **Swagger** | API documentation |
| **Passport** | Authentication middleware |

---

## 📁 Project Structure

```
event-booking-system/
├── src/
│   ├── auth/              # Authentication module (OTP, JWT)
│   ├── users/             # User management
│   ├── events/            # Event CRUD operations
│   ├── bookings/          # Booking logic with optimistic locking
│   ├── common/            # Shared guards, decorators, types
│   │   ├── guards/        # JWT, Role-based guards
│   │   ├── strategies/    # Passport strategies
│   │   └── types/         # Shared TypeScript interfaces
│   ├── prisma/            # Database service
│   └── main.ts            # Application entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seeds/             # Seed data scripts
├── docs/
│   ├── postman/           # Postman collection
│   ├── TECHNICAL_DESIGN.md
│   └── DATABASE_DESIGN.md
└── README.md              # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**
- **Git**

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/vimalbhoutekar/event-booking-system
cd event-booking-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/event_booking_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Application
PORT=3000
NODE_ENV=development

# Email Service (for OTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Redis (optional, for caching)
REDIS_URI=redis://localhost:6379
```

### Important Notes:
- **Never commit `.env` file** to version control
- Use strong, random values for `JWT_SECRET` in production
- For Gmail, use [App Passwords](https://support.google.com/accounts/answer/185833)

---

## 🗄️ Database Setup

### 1. Create PostgreSQL database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE event_booking_db;

# Exit
\q
```

### 2. Run Prisma migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 3. Seed database (Optional)

```bash
npm run seed
```

This will create:
- Sample admin user
- Sample organizer user
- Sample regular users
- Sample events

---

## ▶️ Running the Application

### Development mode (with hot reload)

```bash
npm run start:dev
```

### Production mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Watch mode

```bash
npm run start:watch
```

The server will start on: **http://localhost:9001**

---

## 📚 API Documentation

### Swagger UI

Once the server is running, access interactive API documentation:

```
http://localhost:9001/api-spec
```

### Postman Collection

Import the Postman collection from:

```
docs/postman/Event_Booking_System.postman_collection.json
```

### Quick API Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| **Authentication** |
| POST | `/auth/send-code` | Send OTP for registration | Public |
| POST | `/auth/register` | Register with OTP verification | Public |
| POST | `/auth/login` | Login and get JWT token | Public |
| **Events** |
| GET | `/events` | List all events | Public |
| GET | `/events/:id` | Get single event | Public |
| POST | `/events` | Create event | ORGANIZER |
| PUT | `/events/:id` | Update event | ORGANIZER (owner) |
| DELETE | `/events/:id` | Delete event | ORGANIZER (owner) |
| GET | `/events/organizer/my-events` | Get my events | ORGANIZER |
| **Bookings** |
| POST | `/bookings` | Book seats | USER/ORGANIZER |
| GET | `/bookings` | Get my bookings | USER/ORGANIZER |
| GET | `/bookings/:ref` | Get booking by reference | USER/ORGANIZER |
| DELETE | `/bookings/:ref` | Cancel booking | USER/ORGANIZER (owner) |

---

## 🧪 Testing

### Manual Testing

1. **Register Organizer**
   ```bash
   # Send OTP
   POST /auth/send-code
   {
     "email": "organizer@example.com",
     "type": "register"
   }
   
   # Register with OTP
   POST /auth/register
   {
     "firstname": "John",
     "lastname": "Doe",
     "email": "organizer@example.com",
     "password": "SecurePass@123",
     "country": "India",
     "emailVerificationCode": "123456",
     "role": "ORGANIZER"
   }
   ```

2. **Create Event**
   ```bash
   POST /events
   Authorization: Bearer <organizer-token>
   {
     "title": "Tech Conference 2025",
     "totalSeats": 100,
     "status": "PUBLISHED"
   }
   ```

3. **Book Seats**
   ```bash
   POST /bookings
   Authorization: Bearer <user-token>
   {
     "eventId": 1,
     "seatCount": 3
   }
   ```

### Concurrent Booking Test

Use Postman Collection Runner:
1. Select "Create Booking" request
2. Set iterations: 5
3. Set delay: 0ms
4. Run - only valid bookings will succeed!

---

## 🔑 Key Implementation Details

### 1. Optimistic Locking

**Problem:** Multiple users booking same seats simultaneously can cause double booking.

**Solution:** Version-based concurrency control

```typescript
// Event model has a 'version' field
model Event {
  version Int @default(0)
}

// When booking, check version hasn't changed
const updatedEvent = await prisma.event.updateMany({
  where: {
    id: eventId,
    version: currentVersion  // Check version matches
  },
  data: {
    availableSeats: availableSeats - seatCount,
    version: currentVersion + 1  // Increment version
  }
});

// If update count is 0, version mismatch - retry
```

**Retry Logic:** Automatically retries up to 3 times with exponential backoff.

### 2. Role-Based Authorization

```typescript
// User roles defined in database
enum UserRole {
  USER
  ORGANIZER
}

// Protected endpoint example
@UseGuards(JwtAuthGuard, UserRoleGuard)
@UserRoles(UserRole.ORGANIZER)
async createEvent() {
  // Only ORGANIZER can access
}
```

### 3. Database Indexing

```prisma
model Event {
  @@index([organizerId])  // Fast lookup of organizer's events
  @@index([status])       // Filter by status
  @@index([eventDate])    // Sort by date
}

model Booking {
  @@index([userId])              // User's bookings
  @@index([eventId])             // Event's bookings
  @@index([bookingReference])    // Quick lookup by reference
}
```

---

## 📖 Documentation

Additional documentation available in `docs/` folder:

- **Technical Design Document** - `docs/TECHNICAL_DESIGN.md`
- **Database Design** - `docs/DATABASE_DESIGN.md`
- **Postman Collection** - `docs/postman/`

---

## 🐛 Troubleshooting

### Common Issues

**1. Database connection error**
```
Error: Can't reach database server
```
**Solution:** Check PostgreSQL is running and DATABASE_URL is correct

**2. Prisma Client not generated**
```
Error: @prisma/client did not initialize yet
```
**Solution:** Run `npx prisma generate`

**3. Migration failed**
```
Error: Migration failed to apply
```
**Solution:** Drop database and recreate
```bash
npx prisma migrate reset
```

**4. OTP not received**
```
Check email service logs or console output for OTP code
```

### Debug Mode

Enable detailed logging:
```env
LOG_LEVEL=debug
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Vimal Bhoutekar**
- GitHub: [@vimalbhoutekar](https://github.com/yourusername)
- Email: vimalbhoutekar@gmail.com
- LinkedIn: [vimalbhoutekar](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- Optimistic Locking pattern references
- My internship mentor and team

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Email: your.email@example.com

---

**Built with ❤️ using NestJS and TypeScript**