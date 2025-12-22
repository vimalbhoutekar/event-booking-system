# 🎫 Event Booking System - Production Grade

A scalable event booking platform built with **NestJS** featuring payment gateway integration (Razorpay), real-time seat management with optimistic locking, automated ticket generation (QR + PDF), and comprehensive booking management.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=flat&logo=razorpay&logoColor=white)](https://razorpay.com/)

---

## 🚀 Live Demo

**API Documentation (Swagger):** [http://localhost:9001/api-spec](http://localhost:9001/api-spec)

**Key Features:**

- 💳 Razorpay Payment Integration
- 🎟️ QR Code + PDF Ticket Generation
- ⚡ Real-time Seat Management (Optimistic Locking)
- 🔄 Auto-expire PENDING Bookings (5 min)
- 💰 Cancellation with Refund Logic
- 📊 Settlement Management for Organizers
- 🔐 JWT Authentication + Role-based Access

---

## 📋 Table of Contents

- [Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the App](#-running-the-application)
- [API Testing](#-api-testing)
- [Project Structure](#-project-structure)
- [Key Implementations](#-key-implementation-details)
- [Production Deployment](#-production-deployment)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Key Features

### 🎪 Event Management

- Create, update, delete events (Organizers only)
- Event categories (Concert, Sports, Conference, etc.)
- Venue details with location mapping
- Cancellation policy configuration
- Event lifecycle (Draft → Published → Completed)

### 💳 Payment System

- **Razorpay Integration** (Test & Live modes)
- **GST Calculation** (Toggle-enabled: 18% on platform fee)
- **Visible Platform Fee** (BookMyShow-style pricing)
- Payment signature verification
- Webhook support for payment updates
- Refund processing

### 🎟️ Booking Management

- **Real-time Seat Availability** with optimistic locking
- **Idempotency** - Duplicate booking prevention
- **5-Minute Payment Timer** - Auto-expiry for PENDING bookings
- **Concurrent Booking Handling** - Race condition prevention
- Booking history with filters

### 🎫 Ticket Generation

- **QR Code Generation** (Encrypted booking data)
- **PDF Tickets** (Professional layout)
- **Single QR per Booking** (Multiple seats support)
- Entry tracking (Scan & mark attended)
- Downloadable tickets

### 🔄 Cancellation & Refunds

- **3-Hour Deadline Logic** (Before event)
- **Partial Refund** (With cancellation charges)
- **No Refund** (Within 3 hours of event)
- Automatic seat release
- Razorpay refund integration

### ⏰ Automation

- **Auto-expire** PENDING bookings (Every minute)
- **Cleanup** old expired bookings (Daily)
- **Mark completed** past events (Hourly)
- Race condition prevention with locks

### 💰 Settlement System

- Period-based settlements (Weekly/Monthly)
- Commission tracking
- Bank transfer details
- Settlement-booking junction table (Audit trail)
- Organizer dashboard

---

## 🛠️ Tech Stack

### Backend

- **Framework:** NestJS v10
- **Language:** TypeScript v5
- **Database:** PostgreSQL v14+
- **ORM:** Prisma v6
- **Authentication:** JWT + Passport
- **Payment Gateway:** Razorpay v2.9
- **Scheduler:** @nestjs/schedule v4

### Additional Libraries

- **QR Code:** qrcode v1.5
- **PDF Generation:** pdfkit v0.13
- **Date Handling:** date-fns v3
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   Frontend      │  (React/Next.js - Future)
│   (Web/Mobile)  │
└────────┬────────┘
         │
         │ REST API
         ▼
┌─────────────────────────────────────────┐
│         NestJS Application              │
│  ┌─────────────────────────────────┐   │
│  │   Controllers (API Layer)       │   │
│  └──────────┬──────────────────────┘   │
│             │                           │
│  ┌──────────▼──────────────────────┐   │
│  │   Services (Business Logic)     │   │
│  │  - Events  - Bookings           │   │
│  │  - Payments - Tickets           │   │
│  │  - Cancellations - Settlements  │   │
│  └──────────┬──────────────────────┘   │
│             │                           │
│  ┌──────────▼──────────────────────┐   │
│  │   Prisma ORM                    │   │
│  └──────────┬──────────────────────┘   │
└─────────────┼──────────────────────────┘
              │
              ▼
     ┌────────────────┐
     │  PostgreSQL DB │
     └────────────────┘

External Services:
├─ Razorpay (Payment Gateway)
├─ Email Service (Notifications)
└─ File Storage (Tickets/QR Codes)
```

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** v14+ ([Download](https://www.postgresql.org/))
- **npm** or **yarn**
- **Git**
- **Razorpay Account** (Test mode) - [Sign up](https://razorpay.com/)

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/vimalbhoutekar/event-booking-system.git
cd event-booking-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your configurations (see next section)

---

## 🔐 Environment Variables

Create `.env` file in root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/event_booking_db"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Application
PORT=9001
NODE_ENV=development
NODE_TYPE=master

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

# GST Configuration (Toggle)
GST_ENABLED=false
GST_RATE=18
PLATFORM_COMMISSION_RATE=10

# Booking Configuration
BOOKING_EXPIRY_MINUTES=5
CANCELLATION_HOURS_BEFORE_EVENT=24

# File Storage
TICKET_STORAGE_PATH=./uploads/tickets
STORAGE_DIR=uploads

# Email Service (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Redis (Optional - for caching)
REDIS_URI=redis://localhost:6379
```

**Important:**

- Get Razorpay keys from: [Dashboard → Settings → API Keys](https://dashboard.razorpay.com/)
- Use **Test Mode** keys for development
- Never commit `.env` to version control

---

## 🗄️ Database Setup

### 1. Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE event_booking_db;

# Exit
\q
```

### 2. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 3. Seed Database (Optional)

```bash
npm run seed
```

Creates sample:

- Admin user
- Organizer user
- Regular users
- Sample events

---

## ▶️ Running the Application

### Development Mode (Hot Reload)

```bash
npm run start:dev
```

### Production Mode

```bash
# Build
npm run build

# Start
npm run start:prod
```

### Watch Mode

```bash
npm run start:watch
```

**Server will start at:** `http://localhost:9001`

**Swagger Documentation:** `http://localhost:9001/api-spec`

---

## 🧪 API Testing

### Quick Start Guide

#### 1. Register Organizer

```http
POST /auth/send-code
Content-Type: application/json

{
  "email": "organizer@test.com",
  "type": "register"
}
```

```http
POST /auth/register
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "organizer@test.com",
  "password": "Test@123",
  "country": "India",
  "emailVerificationCode": "123456",
  "role": "ORGANIZER"
}
```

**Copy JWT token** from response!

---

#### 2. Create Event

```http
POST /events
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Tech Conference 2025",
  "description": "Amazing tech event",
  "totalSeats": 100,
  "basePrice": 500,
  "category": "CONFERENCE",
  "venue": "Convention Center",
  "city": "Mumbai",
  "eventDate": "2025-12-31T18:00:00Z",
  "status": "PUBLISHED"
}
```

**Response includes:**

- `basePrice`: 500 (Organizer sets)
- `platformFee`: 50 (10% commission)
- `finalPrice`: 550 (User pays)

---

#### 3. Create Booking (User)

```http
POST /bookings
Authorization: Bearer USER_JWT_TOKEN

{
  "eventId": 1,
  "seatCount": 2,
  "idempotencyKey": "user123_event1_1733500000"
}
```

**Response includes:**

- Booking reference
- Razorpay order ID
- 5-minute expiry timer

---

#### 4. Verify Payment

```http
POST /bookings/verify-payment
Authorization: Bearer USER_JWT_TOKEN

{
  "bookingReference": "550e8400-e29b-41d4-a716-446655440000",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

**Result:**

- Booking confirmed
- QR code generated
- PDF ticket created

---

#### 5. Cancel Booking

```http
POST /cancellations/cancel
Authorization: Bearer USER_JWT_TOKEN

{
  "bookingReference": "550e8400-e29b-41d4-a716-446655440000",
  "reason": "Personal reasons"
}
```

**Refund Logic:**

- **24+ hours before:** Partial refund (with charges)
- **3-24 hours before:** No refund
- **Past event:** Cannot cancel

---

### Testing Scenarios

**Concurrency Test:**

- Open 2 tabs
- Book same seats simultaneously
- Result: Only 1 succeeds (optimistic locking works!)

**Auto-Expiry Test:**

- Create booking
- Don't pay
- Wait 5 minutes
- Booking → EXPIRED
- Seats → Released

**Idempotency Test:**

- Send same booking request twice
- Result: Same booking returned (no duplicate!)

---

## 📁 Project Structure

```
src/
├── auth/              # Authentication (JWT, OTP)
├── users/             # User management
├── admin/             # Admin operations
├── events/            # Event CRUD
├── bookings/          # Booking management
├── payments/          # Razorpay integration
├── tickets/           # QR + PDF generation
├── cancellations/     # Refund logic
├── settlements/       # Organizer payments
├── scheduler/         # Cron jobs
├── common/            # Guards, decorators, utils
│   ├── guards/        # JWT, Role guards
│   ├── utils/         # GST calculator
│   └── types/         # Shared interfaces
├── configs/           # Configuration files
│   ├── razorpay.config.ts
│   ├── gst.config.ts
│   └── booking.config.ts
└── prisma/            # Database service
```

---

## 🔑 Key Implementation Details

### 1. Optimistic Locking (Concurrency Control)

**Problem:** Multiple users booking same seats simultaneously

**Solution:** Version-based locking

```typescript
const updatedEvent = await prisma.event.updateMany({
  where: {
    id: eventId,
    version: currentVersion, // Check version matches
  },
  data: {
    availableSeats: { decrement: seatCount },
    version: { increment: 1 }, // Increment version
  },
});

// If count = 0, conflict occurred - retry!
```

**Automatic retry** with exponential backoff (max 3 attempts)

---

### 2. Idempotency (Duplicate Prevention)

**Problem:** User clicks "Book" twice → 2 bookings

**Solution:** Idempotency key

```typescript
if (dto.idempotencyKey) {
  const existing = await prisma.booking.findUnique({
    where: { idempotencyKey: dto.idempotencyKey },
  });

  if (existing) {
    return existing; // Return same booking
  }
}
```

---

### 3. GST Calculation

**GST Toggle:** Enable/disable via environment variable

**Calculation:**

```
Base Price:     ₹500 (per seat)
Platform Fee:   ₹50  (10% commission)
GST (18%):      ₹9   (on platform fee, if enabled)
─────────────────────────────────
Final Price:    ₹559 (User pays)

Settlement:
Organizer gets: ₹500
Platform gets:  ₹59 (₹50 + ₹9)
```

---

### 4. Payment Flow

```
1. Create Booking → PENDING
   ├─ Reserve seats
   ├─ Start 5-min timer
   └─ Create Razorpay order

2. User Pays on Razorpay
   ├─ Payment successful
   └─ Callback to backend

3. Verify Payment → CONFIRMED
   ├─ Verify signature
   ├─ Update booking status
   ├─ Generate QR + PDF
   └─ Send confirmation email
```

---

### 5. Scheduler (Auto-Expire)

**Cron Job:** Every 1 minute

**Logic:**

```typescript
1. Find PENDING bookings where expiresAt < now
2. In transaction:
   - Mark bookings EXPIRED
   - Release seats to events
3. Prevent race conditions with lock
```

**Race Condition Prevention:**

- In-memory lock (`isProcessing` flag)
- Double-check status before updating
- Transaction safety

---

## 🚀 Production Deployment

### Environment Checklist

- [ ] Change `JWT_SECRET` to strong random value
- [ ] Use Razorpay **Live Mode** keys
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Setup Redis for caching
- [ ] Configure email service
- [ ] Setup file storage (S3/Cloudinary)
- [ ] Enable database backups
- [ ] Setup monitoring (Sentry, LogRocket)

### Docker Deployment

```bash
# Build
docker build -t event-booking-system .

# Run
docker run -p 9001:9001 event-booking-system
```

### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Start
pm2 start dist/main.js --name event-booking

# Monitor
pm2 monit
```

---

## 🐛 Troubleshooting

### Database Connection Error

```
Error: Can't reach database server
```

**Solution:** Check PostgreSQL is running and `DATABASE_URL` is correct

---

### Prisma Client Not Generated

```
Error: @prisma/client did not initialize
```

**Solution:** Run `npx prisma generate`

---

### Migration Failed

```
Error: Migration failed to apply
```

**Solution:**

```bash
npx prisma migrate reset
npx prisma migrate dev
```

---

### QR Code / PDF Generation Error

```
Error: Cannot write file
```

**Solution:** Create directories

```bash
mkdir -p uploads/tickets uploads/qr-codes
```

---

### Scheduler Running Twice

```
Available seats > Total seats
```

**Solution:** Check for multiple Node instances. Kill old processes:

```bash
# Windows
taskkill /f /im node.exe

# Linux/Mac
pkill node
```

---

## 📊 Database Schema Highlights

**Core Tables:**

- `event` - Event details with pricing
- `booking` - Bookings with QR/PDF
- `payment` - Payment records (Razorpay)
- `cancellation` - Refund tracking
- `settlement` - Organizer payments
- `settlement_booking` - Junction table (Audit)

**Key Features:**

- Soft delete on major tables
- Optimistic locking (version field)
- Comprehensive indexing
- Audit trail support

---

## 🤝 Contributing

Contributions welcome! Please follow:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

MIT License - see LICENSE file

---

## 👤 Author

**Vimal Bhoutekar**

- Email: vimalbhoutekar@gmail.com
- GitHub: [@vimalbhoutekar](https://github.com/vimalbhoutekar)
- LinkedIn: [vimalbhoutekar](https://linkedin.com/in/vimalbhoutekar)

---

## 🙏 Acknowledgments

- NestJS Documentation
- Prisma Documentation
- Razorpay API Documentation
- BookMyShow (for inspiration)

---

## 📞 Support

For issues or questions:

- Open an issue on GitHub
- Email: vimalbhoutekar@gmail.com

---

**Built with ❤️ using NestJS, TypeScript, and PostgreSQL**
