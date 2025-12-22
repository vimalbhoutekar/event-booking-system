# Yogic City - Technical Overview & Architecture

## 📖 Document Purpose

This document provides a **complete overview** of the Yogic City platform - explaining what it does, how it works, and what technologies power it. Written for both technical developers and non-technical stakeholders.

**Version:** 1.0  
**Last Updated:** December 2025  
**Status:** Ready for Development

---

## 🎯 What is Yogic City?

**Yogic City** is an online marketplace that connects **yoga instructors** with **students** looking to learn yoga. Think of it like "Uber for Yoga Classes" - students can find, book, and pay for yoga classes through the platform, while instructors can manage their schedules, classes, and earnings.

### Core Value Proposition

**For Students:**

- Find verified yoga instructors near you
- Book classes instantly with secure payment
- Read reviews from other students
- Choose from group classes, private sessions, or workshops

**For Instructors:**

- Reach thousands of potential students
- Manage bookings and schedules easily
- Receive payments weekly with transparent commission
- Build your reputation through reviews

**For Platform (Yogic City):**

- Earn commission on each booking (15%)
- Quality-controlled marketplace
- Scalable business model

---

## 🏗️ Platform Architecture (High-Level)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Students  │◄───────►│  Yogic City  │◄───────►│ Instructors │
│  (Web App)  │         │   Platform   │         │  (Web App)  │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Admin Dashboard │
                    │  (Management)    │
                    └──────────────────┘

External Services:
├─ Razorpay (Payments)
├─ MSG91 (SMS/OTP)
├─ SendGrid (Emails)
├─ Cloudinary (Images)
└─ Google Maps (Location)
```

---

## 💻 Technology Stack (Final)

### Backend (Server-Side)

**Runtime & Framework:**

- **Node.js 20 LTS** - JavaScript runtime (server environment)
- **Express.js** - Web framework for building APIs
- **TypeScript** - Adds type safety to JavaScript (prevents bugs)

**Why TypeScript?**

- Catches errors before code runs
- Better code editor support (autocomplete)
- Makes code more maintainable
- Industry standard for production apps

---

### Database & Hosting

**Database:**

- **PostgreSQL 15+** - Powerful relational database
- **Hosting:** Supabase Free Tier
- **Size:** 500MB (enough for 5,000+ users for MVP)
- **Extensions:** PostGIS (for location queries)

**What We Use from Supabase:**

```
✅ PostgreSQL Database (free)
✅ PostGIS Extension (location search)
✅ Database Dashboard (visual table viewer)
✅ SSL encryption
✅ Automatic backups (7 days)

❌ NOT Using: Supabase Auth (building custom)
❌ NOT Using: Supabase Storage (using Cloudinary)
❌ NOT Using: Supabase Realtime (building custom)
```

**Why This Approach?**

- Free PostgreSQL without lock-in
- Standard connection (works with any tool)
- Can migrate easily if needed
- Full control over auth and features

**Database ORM:**

- **Prisma** - Modern, type-safe database toolkit
- Works seamlessly with Supabase PostgreSQL
- Provides Prisma Studio (visual database browser)
- Handles migrations automatically

---

### Backend Hosting

**Hosting Platform:** Railway or Render (Free tier)

**Why Railway/Render?**

- Free tier available (good for MVP)
- Auto-deployment from GitHub
- Environment variables management
- Easy scaling when needed
- No credit card required initially

**Cost:** ₹0 for first few months (free tier)

---

### Authentication & Security

**Authentication:** Custom JWT-based system

**Methods:**

1. Phone OTP via MSG91 (Primary)
2. Google OAuth 2.0 (Secondary)

**Why Custom Auth (not Supabase Auth)?**

- Full control over user flow
- No vendor lock-in
- Flexibility for future features
- Industry-standard patterns

**Libraries:**

- jsonwebtoken (JWT)
- bcrypt (password hashing)
- passport-google-oauth20 (Google login)
- MSG91 SDK (SMS OTP)

---

### File Storage

**Provider:** Cloudinary (Free tier)

**Features:**

- Automatic image optimization
- On-the-fly resizing
- CDN delivery (fast loading)
- Free: 25GB storage, 25GB bandwidth

**Why Cloudinary (not Supabase Storage)?**

- Better optimization (WebP conversion)
- More features (face detection, smart crop)
- Larger free tier
- Industry-standard for images

---

### External Services

**Payment Gateway:** Razorpay

- UPI, Cards, Net Banking, Wallets
- 2% transaction fee
- Indian market optimized

**SMS:** MSG91

- OTP delivery
- Booking confirmations
- Cost: ~₹0.20 per SMS

**Email:** SendGrid

- Transactional emails
- Receipts, confirmations
- Free: 100 emails/day

**Maps:** Google Maps API

- Geocoding
- Distance calculations
- Location search

---

### API Architecture

**Style:** RESTful API

**What is REST?**

- Standard way to build web APIs
- Uses HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove)
- Industry standard - every developer knows it

**API Versioning:** `/api/v1/`

**Why Version?**

- Can update API without breaking old apps
- Mobile apps may use older versions
- Smooth transition when adding new features

---

### Authentication & Security

**Authentication Method:**

- **JWT (JSON Web Tokens)** - Industry standard for secure login
- **Custom implementation** - Full control over auth logic

**How Users Sign In:**

1. **Phone Number + OTP** (Primary)
   - User enters phone: 9876543210
   - System generates 6-digit code
   - Sends via SMS using MSG91
   - User enters code → Logged in
   - JWT token issued (valid 30 days)

   **Why MSG91?**
   - Indian SMS service (cheaper than Twilio)
   - Reliable delivery
   - Cost: ~₹0.20 per SMS
   - DLT registered (compliant)

2. **Google Sign-In** (Secondary)
   - One-click login with Google account
   - OAuth 2.0 standard
   - No password to remember
   - Fast and secure
   - We build the integration (not using Supabase Auth)

**Auth Implementation:**

```
We're building custom auth system because:
✅ Full control over user flow
✅ Can customize OTP logic
✅ No vendor lock-in
✅ Learn industry-standard auth patterns
✅ More flexible for future features

Libraries used:
- jsonwebtoken (JWT generation)
- bcrypt (password hashing)
- passport-google-oauth20 (Google login)
- twilio or MSG91 SDK (SMS)
```

**Security Features:**

- Passwords hashed with bcrypt (can't be reversed)
- JWT tokens expire after 30 days
- Refresh tokens for seamless re-authentication
- Rate limiting (prevents spam/abuse - max 5 OTP requests per hour)
- HTTPS only (encrypted connection)
- OTP expires after 10 minutes

---

### Payment Processing

**Payment Gateway:** Razorpay

**Flow:**

```
Student Books Class
    ↓
Student Pays ₹500 (UPI/Card/Wallet)
    ↓
Money goes to Yogic City account
    ↓
Platform deducts 15% commission (₹75)
    ↓
Every Friday: Instructor receives ₹425
```

**Supported Payment Methods:**

- UPI (Google Pay, PhonePe, Paytm)
- Credit/Debit Cards (Visa, Mastercard, RuPay)
- Net Banking (all major banks)
- Wallets (Paytm, Mobikwik, etc.)

**Why Razorpay?**

- Most popular in India
- Supports all Indian payment methods
- Excellent documentation
- Used by Zomato, Swiggy, BookMyShow

---

### File Storage

**Image & File Storage:** Cloudinary

**What Gets Stored:**

- Instructor profile photos
- Studio photos (gallery)
- Yoga certificates (PDF/images)
- Review photos (from students)

**Why Cloudinary (Not Supabase Storage)?**

- ✅ **Automatic image optimization** - Converts to WebP, compresses automatically
- ✅ **On-the-fly transformations** - Resize images without storing multiple versions
- ✅ **Better CDN** - Faster global delivery
- ✅ **Free tier:** 25GB storage, 25GB bandwidth (enough for 5,000+ instructor profiles)
- ✅ **Industry standard** - Used by major platforms
- ✅ **More features** - Face detection, smart cropping, video support

**Cloudinary Free Tier:**

```
Storage: 25GB (stores ~10,000 high-quality images)
Bandwidth: 25GB/month (~50,000 image views)
Transformations: 25,000/month
Cost: ₹0 (completely free)


```

**Example Usage:**

```
Upload: instructor_profile.jpg (2MB original)
Cloudinary returns URL with automatic optimization:

Thumbnail: /w_150,h_150,c_fill/instructor_profile.jpg (10KB)
Profile: /w_500,h_500,q_auto,f_auto/instructor_profile.jpg (80KB)
Original: /instructor_profile.jpg (2MB)

All generated on-demand, stored once!
```

**Alternative Considered (Supabase Storage):**

```
Why we're NOT using Supabase Storage:
❌ No automatic optimization (images stay large)
❌ No on-the-fly transformations
❌ Limited free tier (1GB storage)
❌ Basic CDN (slower than Cloudinary)
❌ Would need separate image processing

Decision: Use Cloudinary for better performance and features
```

---

### Communication Services

**SMS:** MSG91

- OTP for login
- Booking confirmations
- Class reminders
- Cost: ~₹0.20 per SMS

**Email:** SendGrid

- Booking receipts
- Weekly summaries
- Marketing emails
- Free tier: 100 emails/day

**In-App Messaging:**

- Students can message instructors
- Stored in PostgreSQL database
- Real-time features in Phase 2

---

### Location Services

**Provider:** Google Maps API

**Features Used:**

1. **Geocoding** - Convert "Vijay Nagar, Indore" to coordinates (22.7196, 75.8577)
2. **Reverse Geocoding** - Convert coordinates to address
3. **Distance Calculation** - Find distance between user and instructor
4. **Maps Display** - Show instructor studio on map

**Location Search (How it Works):**

```
User: "Find yoga instructors near me"
    ↓
System gets user's location (with permission)
    ↓
PostgreSQL PostGIS searches database:
- Within 10km radius
- Sorted by distance (nearest first)
    ↓
Returns: Top 20 instructors with distance
```

**PostGIS Extension:**

- Adds powerful location features to PostgreSQL
- Used by Uber, Airbnb, Zomato
- Can handle millions of location queries per second

---

## 🎨 Core Features Overview

### 1. Platform Model: Hybrid Marketplace

**What is Hybrid?**

- **Open:** Any certified instructor can join
- **Curated:** Admin verifies all instructors
- **Quality Badges:** "Verified", "Top Rated", "Featured"

**Think of it like:**

- Airbnb: Anyone can list property, but verified hosts get badge
- Amazon: Anyone can sell, but "Amazon's Choice" products highlighted

---

### 2. Revenue Model: Commission-Based

**Phase 1 (Launch - Month 1-6):**

```
Instructor teaches class → Earns ₹500
Platform takes 15% commission → ₹75
Instructor receives 85% → ₹425
```

**Phase 2 (Month 6+):**

```
Instructors can choose:

Option A: Pay per booking (15% commission)
- Good for new instructors (no upfront cost)
- Pay only when they earn

Option B: Monthly subscription (₹1,999)
- 0% commission (keep 100% of earnings)
- Good for active instructors (50+ classes/month)
```

**Commission Tiers:**

```
Standard Instructors: 15%
Silver (50+ classes, 4.5+ rating): 12%
Gold (200+ classes, 4.8+ rating): 10%
```

---

### 3. User Roles & Permissions

#### **Students (App Users)**

✅ Can Do:

- Search instructors by location, style, price
- View instructor profiles with photos and reviews
- Book classes (group, private, workshop)
- Pay securely via Razorpay
- Cancel bookings (based on policy)
- Rate and review instructors
- Message instructors (ask questions)
- View booking history

❌ Cannot Do:

- Create classes
- Access other students' data
- Edit instructor profiles

---

#### **Instructors (Service Providers)**

✅ Can Do:

- Create detailed profile (bio, photos, certificates)
- Create multiple types of classes:
  - Group classes (e.g., "Morning Hatha Yoga")
  - Private sessions (1-on-1)
  - Workshops (special events)
- Set their own schedule (days, times)
- Set their own prices
- View all their bookings
- Mark attendance after class
- View earnings dashboard
- Respond to reviews
- Message students
- Offer classes at studio, student's home, or online

❌ Cannot Do:

- Edit other instructors' data
- Access student payment info (except earnings)
- Delete confirmed bookings
- Change platform policies

---

#### **Admin (Platform Team)**

✅ Can Do:

- Review and approve instructor applications
- Verify certificates
- View platform analytics (bookings, revenue, growth)
- Moderate flagged reviews
- Handle disputes between students and instructors
- Process refunds (within policy)
- Suspend users for policy violations
- Manage featured instructors

❌ Cannot Do:

- Edit instructor profiles (only verification status)
- Change ratings
- Read private messages (unless reported)
- Delete successful bookings without reason
- Override payment amounts

**Why Limited Admin Power?**

- Maintains trust in platform
- Protects user privacy
- Clear accountability
- Prevents abuse of power

---

### 4. Booking System Architecture

**Two Modes:**

**Mode A: Instant Confirmation (Group Classes)**

```
Student selects class
    ↓
Student pays ₹400
    ↓
Booking confirmed immediately ✅
    ↓
Instructor notified
```

**Best For:** Regular group classes with fixed schedule

---

**Mode B: Request & Approve (Private Sessions)**

```
Student requests booking
    ↓
Instructor receives request
    ↓
Instructor approves/rejects (within 24 hours)
    ↓
If approved → Student pays
    ↓
Booking confirmed ✅
```

**Best For:** Private sessions, home visits, custom requirements

---

**Booking Safety Features:**

**1. Race Condition Prevention**

- Problem: Two students book last slot simultaneously
- Solution: **Optimistic Locking** (database-level protection)
- Result: Only one booking succeeds, other gets "Slot full" message

**2. Payment Hold (10 Minutes)**

```
Student clicks "Book"
    ↓
Slot held for 10 minutes
    ↓
If payment completed → Booking confirmed
If not completed → Slot released automatically
```

**Why?**

- Prevents slot blocking without payment
- Fair to all users
- Automatic cleanup (no manual work)

**3. Transaction Safety**

- All booking + payment operations in database transaction
- Either everything succeeds or everything fails
- No partial data (e.g., booking created but payment failed)

---

### 5. Search & Discovery System

**How Students Find Instructors:**

**Step 1: Location Detection**

```
Option A: GPS-based (automatic)
- "Use my current location" → Gets coordinates
- Most accurate

Option B: Manual entry
- User types: "Vijay Nagar, Indore"
- System converts to coordinates using Google Maps

Option C: Saved locations
- Home, Office (pre-saved by user)
```

**Step 2: Apply Filters**

```
Available Filters:
├─ Distance: 2km, 5km, 10km, 20km
├─ Yoga Style: Hatha, Vinyasa, Ashtanga, Power Yoga, etc.
├─ Price Range: ₹200-2000
├─ Rating: 3+, 4+, 4.5+ stars
├─ Class Type: Group, Private, Workshop
├─ Availability: Morning, Evening, Weekend
├─ Location Mode: Studio, Home Visit, Online
└─ Language: Hindi, English, etc.
```

**Step 3: Sorting**

```
Phase 1 (MVP):
- Sort by distance (nearest first)
- Then by rating (highest first)

Phase 2 (Month 3-6):
- Weighted scoring algorithm:
  * Distance: 30% weight
  * Rating: 25% weight
  * Number of reviews: 15% weight
  * Response time: 10% weight
  * Booking rate: 10% weight
  * Recently active: 10% weight
```

**Search Performance:**

```
Database size: 10,000 instructors
Search query: "Instructors within 10km"
Response time: < 50 milliseconds ⚡
```

**How PostgreSQL PostGIS Makes it Fast:**

- Spatial index on location data
- Optimized distance calculations
- Can handle millions of queries

---

### 6. Review & Rating System

**When Can Students Review?**

- ✅ Only after attending the class (verified bookings)
- ✅ One review per booking
- ✅ Within 30 days of class completion

**What Students Provide:**

**Required:**

- Overall rating (1-5 stars)

**Optional:**

- Category ratings:
  - Teaching quality
  - Communication
  - Studio environment
  - Value for money
- Written review (50-500 characters)
- Photos (up to 3 images)
- Quick tags: "Beginner friendly", "Patient teacher", etc.

**Review Timing Strategy:**

```
Prompt 1: 30 minutes after class (in-app notification)
Prompt 2: 24 hours later (push notification)
Prompt 3: 3 days later (email reminder)
```

**Review Display:**

```
Default Sort: Most Helpful
- Other users can mark reviews as "helpful"
- Helpful reviews appear first
- Balanced view (not just recent or highest)

Other Sort Options:
- Most Recent
- Highest Rating
- Lowest Rating
```

**Instructor Reply:**

- Can reply once per review
- Visible to everyone
- Cannot edit reply after 24 hours
- Monitored for professionalism

**Moderation:**

```
Auto-Filter:
- Profanity / Bad words
- Spam patterns
- Personal information (phone, email)
- External links

Human Review:
- Flagged reviews
- Disputed reviews
- Potentially fake reviews
```

---

### 7. Payment & Refund System

**Cancellation Policy:**

```
24+ Hours Before Class:
└─ 100% refund (full money back)
└─ Processed in 5-7 business days

12-24 Hours Before Class:
└─ 50% refund
└─ Fair to both student and instructor

Less Than 12 Hours Before:
└─ No refund
└─ Instructor prepared, slot likely not filled

No-Show (didn't attend):
└─ No refund
└─ Attendance marked by instructor

Special Cases:
Medical Emergency (with proof):
└─ Full refund granted
└─ Doctor's note required
```

**Refund Processing:**

```
Student cancels booking
    ↓
System checks cancellation time
    ↓
Calculates refund amount (per policy)
    ↓
Initiates refund via Razorpay
    ↓
Money returns to original payment method
    ↓
Email confirmation sent
    ↓
Refund appears in 5-7 business days
```

**Settlement Schedule (For Instructors):**

```
Week Activity:
Monday-Sunday: Classes conducted, payments received

Friday (Settlement Day):
- Platform calculates: Total earnings - Commission
- Bank transfer initiated
- Email receipt sent

Example:
Classes conducted: 12
Gross revenue: ₹5,000
Commission (15%): ₹750
Net payout: ₹4,250 (transferred on Friday)
```

---

### 8. Communication System

**Phase 1 (MVP): Asynchronous Messaging**

**How it Works:**

```
Student: "Is your morning class good for beginners?"
    ↓
Message stored in database
    ↓
Instructor gets notification (email + in-app)
    ↓
Instructor: "Yes! Perfect for beginners..."
    ↓
Student gets notification
```

**Features:**

- Message history (full conversation)
- Unread count badge
- Email notifications for new messages
- Quick reply templates (for instructors)
- File attachments (images)

**Message Moderation:**

- Profanity filter (automatic)
- Rate limiting (max 10 messages/minute)
- Report abuse button
- Admin can view reported conversations

---

**Phase 2 (Month 6): Real-Time Features**

**Additional Features:**

- Online/offline status
- Typing indicators ("Priya is typing...")
- Instant message delivery (WebSocket)
- Read receipts
- Message reactions

---

### 9. Notification System

**Notification Channels:**

**SMS (via MSG91):**

```
Used For:
✅ OTP for login
✅ Booking confirmations
✅ Class starting in 2 hours
✅ Class cancelled
✅ Refund processed

Cost: ~₹0.20 per SMS
Monthly: ~₹2,000-5,000 (for 1000 active users)
```

**Email (via SendGrid):**

```
Used For:
✅ Booking confirmations (with details)
✅ Payment receipts
✅ Weekly earning summaries
✅ Review notifications
✅ Marketing emails (opt-in only)

Cost: Free tier (100 emails/day)
Paid: ₹1,000/month for 10,000 emails
```

**In-App Notifications:**

```
Used For:
✅ New messages
✅ Review received
✅ Booking updates
✅ General updates

Cost: Free (part of platform)
Display: Red badge counter
```

**Smart Timing:**

```
Critical Notifications (Immediate):
- Booking confirmed
- Payment received
- Class cancelled

Reminders (Scheduled):
- Class in 24 hours → Email + Push
- Class in 2 hours → SMS + Push

Summaries (Batched):
- Weekly earnings → Every Monday 9 AM
- Monthly report → 1st of every month
```

**User Preferences:**

```
Students/Instructors can control:
├─ Email: On/Off per notification type
├─ SMS: On/Off (except OTP)
├─ Push: On/Off per type
└─ Quiet Hours: 10 PM - 8 AM (no notifications)
```

---

## 📊 Database Schema Overview

**Main Collections (Tables):**

### 1. Users (Students)

```
Stores: Student accounts
Key Fields:
- id, name, email, phone
- location (latitude, longitude)
- preferences (yoga style, goals, budget)
- saved instructors
- created date
```

### 2. Instructors

```
Stores: Instructor profiles
Key Fields:
- id, name, email, phone, bio
- experience, specializations, languages
- studio details (name, address, location)
- rating (average, count)
- commission tier
- bank details
- verification status
```

### 3. Classes

```
Stores: Class offerings
Key Fields:
- id, instructor_id, name, type
- yoga style, difficulty level
- duration, price
- schedule (days, times)
- capacity (min, max students)
- location mode (studio/home/online)
- status (active/inactive)
```

### 4. Bookings

```
Stores: All bookings
Key Fields:
- id, booking_id (YB123456)
- student_id, instructor_id, class_id
- date, time slot
- price, commission, total
- payment details (Razorpay IDs)
- status (pending/confirmed/cancelled/completed)
- attendance (marked, present)
```

### 5. Reviews

```
Stores: Student reviews
Key Fields:
- id, booking_id
- student_id, instructor_id
- rating (overall + categories)
- review text, photos
- quick tags
- helpful count
- instructor reply
- moderation status
```

### 6. Messages

```
Stores: Conversations
Key Fields:
- id, conversation_id
- sender_id, receiver_id
- message text, attachments
- read status
- created date
```

### 7. Payments

```
Stores: Payment records
Key Fields:
- id, booking_id
- amount, commission
- razorpay_order_id, razorpay_payment_id
- status (pending/completed/failed/refunded)
- refund details
```

---

## 🚀 Deployment & Hosting

### Development Environment

```
Local Machine:
├─ Node.js 20 installed
├─ PostgreSQL 15 installed
├─ VS Code (code editor)
└─ Postman (API testing)
```

### Production Hosting (MVP)

**Option A: Railway.app (Recommended for MVP)**

```
Features:
✅ Free tier available
✅ PostgreSQL included
✅ Auto-deployment from GitHub
✅ Environment variables management
✅ Automatic HTTPS
✅ Easy scaling

Cost: ₹0-3,000/month (starts free)
```

**Option B: Render.com**

```
Features:
✅ Similar to Railway
✅ Free tier for PostgreSQL
✅ Good documentation

Cost: ₹0-3,000/month
```

**Option C: DigitalOcean (For More Control)**

```
Features:
✅ Full server control
✅ More customization
✅ Better for scaling

Cost: ₹3,000-5,000/month
Requires: DevOps knowledge
```

---

### Database Hosting

**MongoDB Atlas vs PostgreSQL:**

**For Yogic City, we use:**

- **Railway PostgreSQL** (included with app hosting)
- OR **Render PostgreSQL** (separate managed database)
- OR **AWS RDS** (for enterprise scale)

**Benefits:**

- Automatic backups daily
- Point-in-time recovery
- SSL encryption
- Monitoring dashboard
- Easy scaling

---

### CDN & Static Files

**Cloudinary:**

- Images stored and optimized
- Free tier: 25GB storage, 25GB bandwidth
- Cost after free tier: ~₹1,500-3,000/month

**CloudFlare (Free):**

- CDN for API responses (caching)
- DDoS protection
- Analytics
- Free SSL certificate

---

## 📈 Scaling Strategy

### Stage 1: MVP (0-1,000 users)

```
Architecture:
- Single server (Railway/Render)
- PostgreSQL database (same hosting)
- Cloudinary for images
- No caching needed yet

Cost: ₹5,000-7,000/month
Performance: < 500ms average API response
```

### Stage 2: Growth (1,000-10,000 users)

```
Upgrades:
- Upgrade server specs
- Add Redis for caching
- Separate database server
- CloudFlare CDN

Cost: ₹15,000-25,000/month
Performance: < 200ms average API response
```

### Stage 3: Scale (10,000-100,000 users)

```
Architecture Changes:
- Multiple app servers (load balancing)
- Database read replicas
- Redis cluster
- Job queue (background tasks)
- Full monitoring (Sentry, DataDog)

Cost: ₹50,000-1,00,000/month
Performance: < 100ms average API response
```

---

## 🔒 Security Measures

### Data Security

- **Encryption:** All data encrypted at rest and in transit
- **HTTPS Only:** SSL certificate (free via Railway/CloudFlare)
- **Password Hashing:** bcrypt (industry standard, irreversible)
- **SQL Injection Prevention:** Prisma protects automatically

### Authentication Security

- **JWT Tokens:** Expire after 30 days
- **Refresh Tokens:** For seamless re-authentication
- **Rate Limiting:** Max 100 requests/minute per user
- **OTP Expiry:** 10 minutes validity

### Payment Security

- **PCI DSS Compliant:** Through Razorpay
- **No Card Storage:** Platform never sees card details
- **Webhook Verification:** Razorpay signatures verified
- **Audit Logging:** All payment actions logged

### Privacy Protection

- **Data Minimization:** Collect only necessary data
- **Access Control:** Role-based permissions
- **Data Retention:** Clear policies (7 years for financial)
- **User Rights:** Can download/delete their data

---

## 📱 Future Enhancements (Post-MVP)

### Phase 2 (Month 3-6)

- Mobile apps (iOS + Android using React Native)
- Real-time chat (WebSocket)
- Push notifications
- Class packages/memberships
- Referral program
- Advanced analytics dashboard

### Phase 3 (Month 6-12)

- AI-powered recommendations
- Live streaming for online classes
- Instructor marketplace (sell yoga props)
- Corporate wellness programs
- Multi-language support (Hindi, regional)
- Gamification (badges, streaks)

### Phase 4 (Year 2+)

- International expansion
- Certification courses platform
- Community features (forums)
- Integration with fitness trackers
- Advanced booking (recurring bookings)
- White-label solution for studios

---

## 🎓 Key Decisions Summary

| Decision Point           | Chosen Option               | Reasoning                             |
| ------------------------ | --------------------------- | ------------------------------------- |
| **Platform Model**       | Hybrid Marketplace          | Balance of scale and quality          |
| **Revenue Model**        | Commission (15%)            | Simple, proven, fair                  |
| **Database**             | PostgreSQL + Prisma         | Transaction safety, type-safety       |
| **Authentication**       | Phone OTP + Google          | Fast, secure, Indian market fit       |
| **Payment Gateway**      | Razorpay                    | Best for Indian market                |
| **Booking Confirmation** | Hybrid (Instant + Approval) | Flexibility for different class types |
| **Search Method**        | PostGIS Location Search     | Fast, accurate, scalable              |
| **File Storage**         | Cloudinary                  | Auto-optimization, free tier          |
| **API Style**            | REST with versioning        | Industry standard, simple             |
| **Notification**         | SMS + Email + In-App        | Multi-channel coverage                |
| **Admin Control**        | Limited with Audit Trail    | Trust and accountability              |

---
