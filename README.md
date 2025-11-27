# Event Booking System with Concurrency Handling

A production-ready event booking system built with NestJS, featuring optimistic locking for handling concurrent bookings and preventing race conditions.

## 🚀 Features

- **Event Management** - Organizers can create, update, and delete events
- **Seat Booking** - Users can book available seats for events
- **Optimistic Locking** - Prevents double booking under high concurrency
- **Automatic Retry Logic** - Handles concurrent booking conflicts gracefully
- **Booking Cancellation** - Users can cancel bookings and release seats
- **Role-Based Access Control** - USER and ORGANIZER roles with proper authorization
- **JWT Authentication** - Secure token-based authentication
- **Swagger Documentation** - Interactive API documentation

## 🛠️ Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Documentation:** Swagger/OpenAPI
- **Validation:** class-validator, class-transformer

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd event-booking-system
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/event_booking_db"
JWT_SECRET="your-secret-key-here"
PORT=3000
```

4. **Run database migrations:**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Seed the database (optional):**
```bash
npm run seed
```

## 🚀 Running the Application

**Development mode:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

Server will be running at: `http://localhost:3000`

## 📚 API Documentation

Once the server is running, access Swagger documentation at:
```
http://localhost:3000/api-docs
```

## 🔐 Authentication

### User Roles

- **USER** - Can book tickets, view bookings, cancel bookings
- **ORGANIZER** - Can create/manage events + all USER permissions

### Getting Started

1. **Register a user:**
```bash
POST /auth/register
```

2. **Login:**
```bash
POST /auth/login
```

3. **Use the JWT token** in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🎫 Key Endpoints

### Events
- `GET /events` - List all events (public)
- `GET /events/:id` - Get single event (public)
- `POST /events` - Create event (ORGANIZER only)
- `PUT /events/:id` - Update event (Owner only)
- `DELETE /events/:id` - Delete event (Owner only)
- `GET /events/organizer/my-events` - Get my events (ORGANIZER only)

### Bookings
- `POST /bookings` - Book seats (USER/ORGANIZER)
- `GET /bookings` - Get my bookings (USER/ORGANIZER)
- `GET /bookings/:reference` - Get booking by reference (USER/ORGANIZER)
- `DELETE /bookings/:reference` - Cancel booking (Owner only)

## 🔥 Concurrency Handling

### How Optimistic Locking Works

1. **Version Field:** Each event has a `version` field that increments on every update
2. **Atomic Updates:** When booking, we check if the version matches before updating
3. **Retry Logic:** If version mismatch occurs (someone else updated), automatically retry up to 3 times
4. **Transaction Safety:** All operations wrapped in database transactions

### Example Flow

```
User A reads event (version: 5, availableSeats: 10)
User B reads event (version: 5, availableSeats: 10)

User A books 5 seats:
  - Check: version still 5? ✅ Yes
  - Update: availableSeats = 5, version = 6 ✅

User B books 5 seats:
  - Check: version still 5? ❌ No (now it's 6)
  - Retry: Read fresh data (version: 6, availableSeats: 5)
  - Update: availableSeats = 0, version = 7 ✅
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Manual Testing

Use the provided Postman collection or test via Swagger UI.

**Concurrent Booking Test:**
Create a simple script to simulate multiple users booking simultaneously and verify only valid bookings succeed.

## 📊 Database Schema

### Key Models

**User**
- `id`, `email`, `password`
- `role` (USER | ORGANIZER)

**Event**
- `id`, `title`, `description`
- `totalSeats`, `availableSeats`
- `status` (DRAFT | PUBLISHED | CANCELLED | COMPLETED)
- `version` (for optimistic locking)
- `organizerId` (foreign key to User)

**Booking**
- `id`, `userId`, `eventId`
- `seatCount`, `status`
- `bookingReference` (UUID)

## 🔒 Security Features

- JWT-based authentication
- Role-based authorization guards
- Input validation on all endpoints
- SQL injection prevention (Prisma ORM)
- Rate limiting ready (can be added)

## 🚧 Future Enhancements

- [ ] Seat categories (VIP, General)
- [ ] Real-time seat availability updates (WebSocket)
- [ ] Email notifications for bookings
- [ ] Payment integration
- [ ] Booking history and analytics
- [ ] Event search and filters
- [ ] Rate limiting on booking APIs

## 📝 Project Structure

```
src/
├── auth/           # Authentication logic
├── users/          # User management
├── events/         # Event CRUD operations
├── bookings/       # Booking logic with optimistic locking
├── common/         # Shared guards, decorators, types
├── prisma/         # Database service
└── main.ts         # Application entry point
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Vimal Bhoutekar**
- GitHub: [@vimalbhoutekar]
- Email: vimalbhoutekar@gmail.com

## 🙏 Acknowledgments

- NestJS documentation
- Prisma documentation
- Optimistic locking pattern references

---

**Built with ❤️ using NestJS**