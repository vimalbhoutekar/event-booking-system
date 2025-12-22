# Yoga Learning Platform - Complete Planning Document

## 📋 Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [User Roles & What They Can Do](#2-user-roles--what-they-can-do)
3. [How Platform Works - User Journeys](#3-how-platform-works---user-journeys)
4. [Features List](#4-features-list)
5. [Business Rules & Policies](#5-business-rules--policies)
6. [Technical Stack](#6-technical-stack)
7. [Implementation Timeline](#7-implementation-timeline)

---

## 1. Platform Overview

### 🎯 What Problem Are We Solving?

**Current Problems:**

- Students can't find verified yoga instructors nearby
- Instructors struggle to get students
- No easy way to book and pay
- Trust issues (fake certificates, poor quality)

**Our Solution:**
A marketplace that connects verified yoga instructors with students through easy online booking and secure payments.

### 💼 Business Model

**Type:** Commission-Based Marketplace (Like UrbanClap)

**How It Works:**

```
Student books a class → Pays ₹500
↓
Platform takes 15% commission (₹75)
↓
Instructor receives ₹425
```

**Revenue Breakdown:**

- Standard instructors: 15% commission
- Good performers: 12% commission (50+ classes, 4.5+ rating)
- Top performers: 10% commission (200+ classes, 4.8+ rating)

---

## 2. User Roles & What They Can Do

### 👨‍💼 ADMIN (Platform Owner/Team)

**Main Jobs:**

1. **Verify New Instructors**
   - Check certificates (200hr Yoga Training required)
   - Verify ID and studio
   - Approve or reject applications

2. **Monitor Quality**
   - Check ratings (remove instructors below 3.5 rating)
   - Handle complaints
   - Remove fake reviews

3. **Manage Money**
   - Process weekly payments to instructors
   - Handle refunds
   - Track platform revenue

4. **View Dashboard**
   - See daily bookings, revenue, new users
   - Check which instructors are doing well
   - Monitor platform health

**Example Dashboard:**

```
TODAY'S STATS:
- Bookings: 156
- Revenue: ₹63,400
- New Students: 23
- Active Instructors: 45
```

---

### 🧘‍♀️ INSTRUCTOR (Yoga Teacher)

**What They Can Do:**

**1. Profile Setup**

```
Create Profile:
├── Add Name, Photo, Bio
├── Upload Certificates
├── Add Studio Details (address, photos)
├── Set Service Area (10km radius for home visits)
└── Add Bank Details (for payments)
```

**2. Create Classes**

```
Example Class:
Name: "Morning Hatha Yoga"
Type: Group Class
Duration: 90 minutes
Price: ₹400 per person
Capacity: Max 15 students
Schedule: Mon/Wed/Fri at 6:30 AM
Location: My studio OR Student's home OR Online
```

**3. Manage Bookings**

```
Dashboard Shows:
├── Today's Classes (with student list)
├── Upcoming Bookings
├── New Messages from students
├── Earnings (this week, this month)
└── Reviews & Ratings
```

**4. Track Earnings**

```
This Week:
- 12 classes conducted
- 89 students taught
- ₹15,300 earned (gross)
- ₹13,005 received (after 15% commission)
- Payment on Friday
```

**Real Example - Priya's Day:**

```
Monday Morning:
6:00 AM - Check today's classes
        - "Morning Hatha Flow" has 8 bookings
        - 2 are first-timers (need extra attention)

6:30 AM - Conduct class

8:00 AM - Mark attendance (all 8 present)
        - Revenue confirmed: ₹2,720

8:15 AM - Receive 5-star review from Rahul
        - Reply: "Thank you! See you Wednesday!"
```

---

### 👤 STUDENT/PARTICIPANT

**What They Can Do:**

**1. Sign Up & Search**

```
Sign Up → Enter Location → Search "Yoga near me"
↓
See Results:
- Priya Verma (2.3 km away) ⭐ 4.8
- Amit Singh (3.8 km away) ⭐ 4.6
- Sneha Gupta (5.2 km away) ⭐ 4.7
```

**2. View Instructor Profile**

```
Priya Verma's Profile:
├── Photo, Bio, 8 years experience
├── Certifications (200hr YTT, Pranayama)
├── Studio Photos (5 images)
├── Classes Offered:
│   ├── Morning Hatha Flow - ₹400 (Group)
│   └── Private Session - ₹700 (1-on-1)
├── Reviews (120 reviews, 4.8 rating)
└── Next Available: Tomorrow 6:30 AM
```

**3. Book a Class**

```
Booking Steps:
1. Select Class → Morning Hatha Flow
2. Choose Date → Monday, Dec 23
3. Enter Details → Name, Experience Level
4. Pay → ₹400 via UPI/Card
5. Confirmation → Booking #YB123456
```

**4. Manage Bookings**

```
My Bookings:
├── Upcoming (2)
│   └── Tomorrow 6:30 AM with Priya
├── Past (5)
│   └── Last Monday - Rated 5 stars
└── Actions: Cancel, Reschedule, Message
```

**Real Example - Rahul's Journey:**

**Day 1 - Discovery:**

```
Evening 7:30 PM:
- Feels stressed from work
- Googles "yoga classes Indore"
- Finds YogaConnect platform
- Signs up with phone number
- Searches instructors near Vijay Nagar
- Finds Priya (4.8 rating, beginner-friendly)
- Saves her profile (not ready to book yet)
```

**Day 2 - Inquiry:**

```
Morning 9:00 AM:
- Gets notification about saved instructor
- Sends message: "Is your class good for beginners?"
- Priya replies in 30 min: "Yes! Perfect for beginners..."
- Rahul feels confident → Decides to book
```

**Day 2 - Booking:**

```
Morning 9:50 AM:
- Selects "Morning Hatha Flow"
- Chooses Monday @ 6:30 AM
- Adds note: "First time, mild back pain"
- Pays ₹400 via Google Pay
- Gets confirmation: Booking #YB123456
- Adds to Google Calendar
```

**Day 4 - Class Day:**

```
Monday 6:20 AM:
- Arrives at Shanti Yoga Studio
- Meets Priya (warm welcome)
- Attends 90-min class (loved it!)

8:15 AM:
- Rates class: 5 stars ⭐⭐⭐⭐⭐
- Writes: "Great first experience! Very comfortable..."
- Books next class for Wednesday
```

---

## 3. How Platform Works - User Journeys

### Journey 1: Student Books First Class

```
RAHUL'S STORY (Complete Beginner)

Problem: Stressed from desk job, back pain

Step 1: Discovery
├── Google search → Finds YogaConnect
├── Signs up (phone: 9876543210)
├── Sets location: Vijay Nagar, Indore
└── Searches: "Beginner yoga morning"

Step 2: Browse Instructors
├── Sees 8 results
├── Opens Priya Verma's profile
│   ├── 4.8 rating (120 reviews)
│   ├── "Perfect for beginners" in reviews
│   ├── Studio looks clean (photos)
│   └── Next slot: Mon 6:30 AM
└── Sends message before booking

Step 3: Communication
├── Asks: "Good for beginners? Provide mats?"
└── Priya replies: "Yes! Mats provided, 10 min early for intro"

Step 4: Booking
├── Selects: Morning Hatha Flow
├── Date: Monday 6:30-8:00 AM
├── Adds: "First timer, back stiffness"
├── Pays: ₹400 (Google Pay)
└── Confirmed: Booking #YB123456

Step 5: Preparation
├── Sunday 7 PM: Reminder notification
├── Sets 3 alarms for Monday
├── Checks location on maps
└── Prepares comfortable clothes

Step 6: Class Day
├── Monday 6:20 AM: Arrives at studio
├── Meets Priya: Quick orientation
├── 6:30-8:00 AM: Attends class
├── Feels: Accomplished, relaxed
└── Thanks Priya, says "See you Wednesday"

Step 7: Post-Class
├── 8:15 AM: Rating prompt appears
├── Rates: 5 stars
├── Writes review: "Great experience!"
├── Books Wednesday class immediately
└── Shares with friend

Result: Happy student → Becomes regular
```

---

### Journey 2: Instructor Joins Platform

```
PRIYA'S STORY (Experienced Teacher)

Problem: Studio has capacity, needs more students

Step 1: Discovery
├── Googles: "yoga instructor platform India"
├── Finds YogaConnect
├── Reads: "Reach thousands of students"
└── Checks commission: 15% (acceptable)

Step 2: Application
├── Saturday morning: Starts application
├── Fills details:
│   ├── Personal info
│   ├── 8 years experience
│   ├── Hatha Yoga specialist
│   ├── Uploads 3 certificates
│   ├── Studio details + 5 photos
│   └── Bank account
├── Submits application
└── Gets Application ID: #INST5678

Step 3: Verification
├── Sunday: Admin reviews application
│   ├── Checks certificates ✓
│   ├── Verifies ID ✓
│   ├── Confirms studio on Google Maps ✓
│   └── Validates bank details ✓
├── Monday 10 AM: Approval email received
└── Sets password, logs in

Step 4: Profile Setup
├── Monday afternoon: Completes profile
│   ├── Uploads professional photos
│   ├── Writes detailed bio
│   ├── Adds studio gallery
│   └── Records intro video (optional)
└── Progress: 100% complete

Step 5: Create First Class
├── Class Name: "Morning Hatha Flow"
├── Type: Group Class (90 min)
├── Price: ₹400, Max 15 students
├── Schedule: Mon/Wed/Fri 6:30 AM
├── Location: Shanti Yoga Studio
└── Auto-confirm: Yes

Step 6: First Booking!
├── Tuesday: Notification appears
│   "You got your first booking!"
│   Student: Rahul Sharma (Beginner)
│   Date: Monday 6:30 AM
├── Sends welcome message to Rahul
└── By Friday: 8 more bookings for same class

Step 7: First Class Day
├── Monday 6:20 AM: Checks student list
│   (9 students, 2 first-timers)
├── 6:30 AM: Conducts class smoothly
├── 8:00 AM: Marks attendance (all present)
├── Revenue confirmed: ₹2,720
├── 8:15 AM: Receives first 5-star review!
└── Replies to review, thanks student

Week 1 Result:
├── 12 classes conducted
├── 89 students taught
├── ₹13,005 earned
└── 4.8 rating (from 8 reviews)

Month 3 Result:
├── 156 classes conducted
├── Income increased 2.5x
├── Top 10 instructor in Indore
└── Featured instructor badge earned
```

---

## 4. Features List

### MVP Features (Launch - Week 1-8)

**For Students:**

```
✅ Registration (Phone/Email/Google)
✅ Location-based search
   Example: "Find yoga within 5km"
✅ Instructor profiles with:
   - Photos, bio, certificates
   - Ratings & reviews
   - Class schedule
✅ Book classes
✅ Pay securely (Razorpay - UPI/Card)
✅ Manage bookings (view/cancel/reschedule)
✅ Rate & review instructors
✅ Message instructors
```

**For Instructors:**

```
✅ Application & verification system
✅ Profile creation with:
   - Bio, photos, certificates
   - Studio details
✅ Create classes:
   - Group/Private/Workshop
   - Set schedule & pricing
✅ Manage bookings
✅ Mark attendance
✅ View earnings dashboard
✅ Message students
✅ Respond to reviews
```

**For Admin:**

```
✅ Verify instructor applications
✅ Dashboard (bookings, revenue, users)
✅ Moderate reviews
✅ Process payments (weekly settlements)
✅ Handle disputes
✅ View analytics
```

---

### Phase 2 Features (Month 2-3)

```
📱 Mobile Apps (iOS + Android)
💬 Real-time chat (Socket.io)
📦 Class packages
   Example: "5 classes for ₹1,800 (10% off)"
🎁 Referral program
   "Refer friend → Get ₹100 credit"
📹 Video testimonials
📊 Advanced analytics
🔔 Smart notifications
```

---

### Phase 3 Features (Month 4-6)

```
🤖 AI recommendations
   "Students like you also booked..."
🏆 Gamification
   Badges, streaks, achievements
📡 Live streaming for online classes
🌍 Multi-language support (Hindi)
💪 Fitness tracker integration
🎓 Certification courses marketplace
```

---

## 5. Business Rules & Policies

### Cancellation Policy

```
Student Cancels:

24+ hours before class:
→ 100% refund (full money back)

12-24 hours before:
→ 50% refund (half money back)

Less than 12 hours:
→ No refund

No-show (didn't attend):
→ No refund

────────────────────────────────

Instructor Cancels:

Any time:
→ Student gets 100% refund
→ Instructor gets warning
→ After 3 cancellations: Suspension

────────────────────────────────

Special Cases:

Medical Emergency (with proof):
→ Full refund

Technical Issue (online class):
→ Full refund + reschedule option

Bad Weather:
→ Full refund or reschedule
```

---

### Commission Structure

```
STANDARD (Default):
Commission: 15%
Example: ₹500 class → ₹75 platform, ₹425 instructor

SILVER TIER:
Requirements:
- 50+ classes done
- 4.5+ rating
- 3+ months active
Commission: 12%
Example: ₹500 class → ₹60 platform, ₹440 instructor

GOLD TIER:
Requirements:
- 200+ classes done
- 4.8+ rating
- 12+ months active
Commission: 10%
Example: ₹500 class → ₹50 platform, ₹450 instructor

NEW INSTRUCTOR BONUS:
First 30 days: 10% commission
(Helps build initial student base)
```

---

### Quality Standards

```
Instructor Requirements:

MANDATORY:
✓ 200-Hour Yoga Teacher Training certificate
✓ Valid government ID
✓ Bank account
✓ Professional photo

ONGOING:
✓ Maintain 4.0+ rating (after 10 reviews)
✓ Below 3.5 rating → Suspension review
✓ Maximum 2 no-shows per year
✓ Professional conduct always

SUSPENSION TRIGGERS:
❌ Fake certificates
❌ Inappropriate behavior
❌ Multiple complaints
❌ Rating drops below 3.5
```

---

## 6. Technical Stack

### Backend

```
Framework: Node.js + Express
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
File Storage: AWS S3 / Cloudinary
Payment: Razorpay

Key Libraries:
- mongoose (database)
- bcrypt (password security)
- jsonwebtoken (auth)
- multer (file uploads)
- nodemailer (emails)
```

### Frontend

```
Web: React.js
Mobile (Phase 2): React Native
Styling: Tailwind CSS
Maps: Google Maps API
State Management: Redux / Context API

Key Libraries:
- react-router-dom (navigation)
- axios (API calls)
- formik (forms)
- react-query (data fetching)
```

### Third-Party Services

```
Payment: Razorpay (UPI, Cards, Wallets)
SMS: Twilio (OTP, notifications)
Email: SendGrid (confirmations)
Maps: Google Maps (location, directions)
Hosting: AWS / DigitalOcean
Analytics: Google Analytics
Error Tracking: Sentry
```

### Database Structure (Simplified)

```javascript
// Key Collections:

Users (Students):
- Name, phone, email, password
- Location, preferences
- Saved instructors

Instructors:
- Personal details
- Certifications, experience
- Studio details
- Service modes (studio/home/online)
- Rating, status

Classes:
- Instructor ID
- Name, type, duration
- Price, capacity
- Schedule
- Location modes

Bookings:
- Student ID, Instructor ID, Class ID
- Date, time
- Payment details
- Status (confirmed/cancelled/completed)
- Attendance

Reviews:
- Booking ID, Student ID, Instructor ID
- Overall rating, category ratings
- Review text
- Instructor reply
```

---

## 7. Implementation Timeline

### Week 1-2: Foundation

```
✓ Setup Node.js project
✓ Design database schema
✓ Create authentication system
✓ Setup React project
✓ Design basic UI components
✓ Setup AWS/Cloudinary for images
```

### Week 3-4: Student Features

```
✓ Registration & Login
✓ Search instructors (with location)
✓ Instructor profile page
✓ Booking flow
✓ Payment integration (Razorpay)
```

### Week 5-6: Instructor Features

```
✓ Instructor application form
✓ Profile creation
✓ Class creation & scheduling
✓ Dashboard (bookings, earnings)
✓ Messaging system
```

### Week 7-8: Admin & Launch

```
✓ Admin dashboard
✓ Instructor verification system
✓ Review/rating system
✓ Testing & bug fixes
✓ Security audit
✓ Deploy to production
✓ Soft launch (beta testing)
```

---

## 8. Example Scenarios

### Scenario 1: Group Class Booking

```
SITUATION:
Student wants to join a group yoga class

FLOW:
1. Student searches "Morning yoga Indore"
2. Finds: Priya's "Morning Hatha Flow"
   - ₹400 per person
   - Mon/Wed/Fri 6:30 AM
   - 8/15 spots filled
3. Clicks "Book Now"
4. Selects: Monday, Dec 23
5. Enters: Name, experience level
6. Pays: ₹400 via UPI
7. Gets: Confirmation + Calendar invite
8. Monday: Attends class
9. After class: Rates 5 stars

PAYMENTS:
- Student paid: ₹400
- Platform takes: ₹60 (15%)
- Instructor gets: ₹340
- Paid on: Friday (weekly settlement)
```

---

### Scenario 2: Private Home Visit

```
SITUATION:
Student wants private yoga session at home

FLOW:
1. Student searches "Home visit yoga"
2. Finds: Amit Singh
   - ₹700 + ₹100 travel = ₹800
   - Serves 10km radius
3. Enters home address
4. System checks: 5.2 km away (within range ✓)
5. Selects: Saturday 10 AM
6. Adds note: "Need help with back pain"
7. Pays: ₹800
8. Saturday 9:50 AM: Amit calls, arrives
9. 10-11 AM: Private session at home
10. Student rates: 5 stars

PAYMENTS:
- Student paid: ₹800
- Platform takes: ₹120 (15%)
- Instructor gets: ₹680
```

---

### Scenario 3: Cancellation

```
SITUATION:
Student needs to cancel a booking

CASE A: Early Cancellation (2 days before)
Student: Cancels Monday class on Saturday
Policy: 24+ hours → 100% refund
Result: ₹400 refunded in 5-7 days
Instructor: Notified, slot becomes available

CASE B: Late Cancellation (6 hours before)
Student: Cancels 6:30 AM class at 12:30 AM
Policy: 12-24 hours → 50% refund
Result: ₹200 refunded, ₹200 kept
Instructor: Gets ₹170 (₹200 minus 15% commission)

CASE C: No Show
Student: Booked but didn't attend
Policy: No refund
Result: ₹0 refunded
Instructor: Gets full amount ₹340
```

---

### Scenario 4: Instructor Application

```
SITUATION:
New yoga teacher wants to join platform

DAY 1 - Application:
- Priya submits application
- Uploads: 200hr YTT, Pranayama cert, Aadhar
- Studio photos: 5 images
- Bank details: SBI account

DAY 2 - Verification:
Admin checks:
✓ Certificates genuine
✓ ID verified
✓ Studio exists on Google Maps
✓ Bank details valid
✓ No previous issues
→ APPROVED

DAY 3 - Setup:
- Priya logs in
- Completes profile (bio, photos)
- Creates first class: "Morning Hatha Flow"
- Sets schedule: Mon/Wed/Fri 6:30 AM
- Goes LIVE

DAY 4 onwards:
- Students start finding her profile
- First booking received!
- Journey begins...
```

---

## 9. Success Metrics

### Platform Health Indicators

```
GOOD SIGNS:
✓ 70%+ students book again (retention)
✓ Average rating 4.5+ across platform
✓ Instructors earning 30%+ more than before
✓ 80%+ bookings completed (not cancelled)
✓ Response time under 2 hours
✓ Less than 5% disputes

WARNING SIGNS:
⚠ High cancellation rate (20%+)
⚠ Many 1-star reviews
⚠ Instructors leaving platform
⚠ Students not rebooking
⚠ Payment failures
⚠ Slow response times
```

---

## 10. Quick Reference

### Key Numbers to Remember

```
COMMISSION:
- Standard: 15%
- Good: 12%
- Top: 10%

CANCELLATION REFUNDS:
- 24+ hours: 100%
- 12-24 hours: 50%
- <12 hours: 0%

INSTRUCTOR REQUIREMENTS:
- Min certification: 200hr YTT
- Min rating: 4.0 (after 10 reviews)
- Max no-shows: 2 per year

PAYMENT SCHEDULE:
- Settlement: Every Friday
- Refund timeline: 5-7 business days
- Commission deducted automatically

TYPICAL PRICING:
- Group class: ₹300-500
- Private session: ₹600-1000
- Workshop: ₹1500-3000
- Online: 20-30% cheaper
```

---

### Contact & Support

```
STUDENT SUPPORT:
- In-app chat
- Email: support@yogaconnect.com
- Phone: 1800-XXX-XXXX
- Response time: Under 4 hours

INSTRUCTOR SUPPORT:
- Dedicated support team
- Email: instructors@yogaconnect.com
- Onboarding assistance
- Marketing help

EMERGENCY:
- Payment issues: Immediate
- Safety concerns: Immediate
- Technical issues: Within 1 hour
```

---

## Summary

**This platform is:**

- 🎯 **Simple**: Easy for anyone to use
- 🔒 **Safe**: Verified instructors, secure payments
- 💰 **Fair**: Transparent pricing, clear policies
- 📈 **Scalable**: Can grow from 10 to 10,000 instructors
- 🤝 **Win-Win**: Good for students AND instructors

**Start with:**

1. Build MVP (6-8 weeks)
2. Launch in ONE city (Indore)
3. Get 10 quality instructors
4. Onboard 100-200 students
5. Gather feedback & improve
6. Then expand to more cities

**Success = Quality over Quantity in the beginning!**

---
