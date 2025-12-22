# Yogic City - Backend Architecture & Feature Decision Document

## 📋 Document Purpose

This document helps you **make informed decisions** about your Yogic City platform. Each section presents:

- 🎯 The feature/concept
- 💡 Multiple approaches/options
- ✅ Pros & Cons of each
- 🔍 Real-world examples
- 💭 My recommendation with reasoning

**You decide** what fits your vision best!

---

## Table of Contents

1. [Platform Core Identity](#1-platform-core-identity)
2. [Revenue Model Options](#2-revenue-model-options)
3. [User Authentication Strategy](#3-user-authentication-strategy)
4. [Class Booking System Architecture](#4-class-booking-system-architecture)
5. [Payment Processing Strategy](#5-payment-processing-strategy)
6. [Search & Discovery Mechanism](#6-search--discovery-mechanism)
7. [Communication System](#7-communication-system)
8. [Review & Rating System](#8-review--rating-system)
9. [Notification Strategy](#9-notification-strategy)
10. [File Storage & Media](#10-file-storage--media)
11. [API Architecture Pattern](#11-api-architecture-pattern)
12. [Database Schema Design Philosophy](#12-database-schema-design-philosophy)
13. [Scaling Strategy](#13-scaling-strategy)
14. [Admin Control Level](#14-admin-control-level)
15. [Feature Prioritization Matrix](#15-feature-prioritization-matrix)

---

## 1. Platform Core Identity

### Question: What type of platform should Yogic City be?

#### Option A: Pure Marketplace (UrbanClap Model)

**How it works:**

- Platform connects instructors with students
- Instructors set their own prices
- Platform takes commission per booking
- Minimal platform control over classes

**Real Example:** UrbanClap, Fiverr

**Pros:**

- ✅ Easy to scale (add instructors without inventory management)
- ✅ Low operational overhead
- ✅ Instructors have autonomy
- ✅ Diverse offerings naturally emerge

**Cons:**

- ❌ Quality inconsistency
- ❌ Price variations confuse users
- ❌ Less brand loyalty (user loyalty to instructor, not platform)
- ❌ Harder to standardize experience

**Best For:** Wide variety, minimal curation, fast growth

---

#### Option B: Curated Platform (ClassPass Model)

**How it works:**

- Platform vets and selects instructors carefully
- Standardized pricing tiers
- Platform designs the experience
- Strong quality control

**Real Example:** ClassPass, Cult.fit

**Pros:**

- ✅ Consistent quality experience
- ✅ Strong brand identity
- ✅ Higher trust from users
- ✅ Can charge premium

**Cons:**

- ❌ Slower to scale (careful selection)
- ❌ More operational work
- ❌ Rejected instructors might complain
- ❌ Less variety initially

**Best For:** Premium positioning, quality-first, urban markets

---

#### Option C: Hybrid Model (Yogic City Recommended)

**How it works:**

- Open marketplace BUT with verification
- Instructors set prices within platform guidelines (₹200-2000)
- Quality badges (Verified, Top Rated, Premium)
- Some featured/curated sections

**Real Example:** Airbnb (anyone can list, but verified hosts get badges)

**Pros:**

- ✅ Balance of scale and quality
- ✅ Market self-regulates via reviews
- ✅ Flexibility for different markets (tier 1 vs tier 2 cities)
- ✅ Can introduce curation gradually

**Cons:**

- ❌ Requires robust review system
- ❌ Need good admin tools
- ❌ Complex pricing structure management

**Decision Questions:**

1. Do you want rapid growth or quality-first growth?
2. Will you focus on one city first or multiple cities?
3. Do you have resources for heavy moderation?

**💡 My Recommendation:** **Option C - Hybrid Model**

**Why?**

- You can start open (get instructors quickly)
- Build reputation through reviews
- Introduce "Yogic City Verified" badge for quality
- Add premium curated section later (Phase 2)
- Most flexible for Indian market (price sensitivity varies)

---

## 2. Revenue Model Options

### Question: How should Yogic City make money?

#### Option A: Commission-Based (Per Booking)

**How it works:**

```
Student books class → Pays ₹500
Platform commission → ₹75 (15%)
Instructor receives → ₹425
```

**Pros:**

- ✅ Aligns with instructor success (they earn, you earn)
- ✅ No upfront cost for instructors
- ✅ Easy to understand
- ✅ Scales with volume

**Cons:**

- ❌ Revenue depends on bookings (unpredictable)
- ❌ Instructors may resent commission
- ❌ Need high volume for profitability

**Typical Rates:**

- Aggressive: 20-25% (UrbanClap)
- Standard: 15% (recommended)
- Competitive: 10-12% (attract top instructors)

---

#### Option B: Subscription for Instructors

**How it works:**

```
Instructors pay monthly fee:
- Basic: ₹999/month (5 classes/month)
- Pro: ₹2,999/month (unlimited classes)
- Premium: ₹4,999/month (unlimited + featured listing)

Students book → Pay directly to instructor
Platform: ₹0 commission
```

**Pros:**

- ✅ Predictable revenue (monthly recurring)
- ✅ Instructors prefer no commission
- ✅ Easy to forecast growth
- ✅ Can offer free trial (first month free)

**Cons:**

- ❌ New instructors hesitate (upfront cost)
- ❌ Revenue not tied to success
- ❌ Need payment processing outside platform
- ❌ Harder to enforce quality (already paid)

**Best For:** Established platform with strong value proposition

---

#### Option C: Hybrid Model (Recommended)

**How it works:**

```
Option 1: Pay per booking (15% commission)
Option 2: Monthly subscription (₹1,999) → 0% commission

Instructor decides which works better for them.
```

**Example:**

```
Instructor A (New, 5 classes/month):
- Per booking: 5 × ₹425 × 15% = ₹319 commission
- Better choice: Pay per booking

Instructor B (Established, 50 classes/month):
- Per booking: 50 × ₹425 × 15% = ₹3,187 commission
- Better choice: Subscription ₹1,999 (saves ₹1,188!)
```

**Pros:**

- ✅ Flexible for instructors
- ✅ Attracts both new and established instructors
- ✅ Predictable base revenue (subscriptions)
- ✅ Volume bonus (commission)

**Cons:**

- ❌ More complex to explain
- ❌ Need to track both models
- ❌ Some instructors will game the system

---

#### Option D: Freemium Model

**How it works:**

```
FREE tier:
- List profile
- 3 classes/month
- Basic support
- 20% commission

PAID tier (₹1,499/month):
- Unlimited classes
- Featured in search
- Priority support
- 10% commission
- Analytics dashboard
```

**Pros:**

- ✅ Easy onboarding (free to try)
- ✅ Converts naturally (see value first)
- ✅ Competitive advantage (others charge from day 1)

**Cons:**

- ❌ Many may stay on free tier
- ❌ Support burden for free users
- ❌ Need strong upgrade incentive

---

#### Option E: Student Subscription (Unlimited Model)

**How it works:**

```
Students pay: ₹999/month
Access: Unlimited classes (any instructor)
Instructors: Paid per student attendance (₹100-200 per class)
```

**Real Example:** ClassPass

**Pros:**

- ✅ Strong student retention (already paid)
- ✅ Predictable revenue
- ✅ High lifetime value per student

**Cons:**

- ❌ Complex payout to instructors
- ❌ Inventory management nightmare
- ❌ Instructors may feel underpaid
- ❌ Not suitable for early stage

**Best For:** Mature platform, corporate wellness programs

---

### Revenue Model Decision Matrix

| Model                       | Early Stage | Predictability | Instructor Appeal | Complexity |
| --------------------------- | ----------- | -------------- | ----------------- | ---------- |
| **Commission**              | ⭐⭐⭐⭐⭐  | ⭐⭐           | ⭐⭐⭐            | ⭐⭐⭐⭐⭐ |
| **Instructor Subscription** | ⭐⭐        | ⭐⭐⭐⭐⭐     | ⭐⭐⭐⭐          | ⭐⭐⭐⭐   |
| **Hybrid**                  | ⭐⭐⭐⭐    | ⭐⭐⭐⭐       | ⭐⭐⭐⭐⭐        | ⭐⭐⭐     |
| **Freemium**                | ⭐⭐⭐⭐⭐  | ⭐⭐⭐         | ⭐⭐⭐⭐⭐        | ⭐⭐⭐     |
| **Student Subscription**    | ⭐          | ⭐⭐⭐⭐⭐     | ⭐⭐              | ⭐         |

**💡 My Recommendation:** Start with **Option A (Commission)** → Transition to **Option C (Hybrid)** after 6 months

**Reasoning:**

1. **Commission-based for MVP** because:
   - Zero barrier to entry for instructors
   - You only earn when they earn (fair)
   - Simple to implement and explain
   - Standard in Indian market

2. **Add subscription option at Month 6** because:
   - By then, instructors see the value
   - Active instructors will calculate and upgrade
   - Provides revenue stability
   - Shows you're instructor-friendly

**Implementation:**

```javascript
// Commission rates based on tier
const commissionRates = {
  standard: 0.15, // Default 15%
  silver: 0.12, // 50+ classes, 4.5+ rating
  gold: 0.1, // 200+ classes, 4.8+ rating
  subscription: 0.0, // Monthly subscribers (Phase 2)
};
```

---

## 3. User Authentication Strategy

### Question: How should users sign up and log in?

#### Option A: Phone Number Only (OTP-based)

**How it works:**

```
1. User enters phone number
2. Receives OTP via SMS
3. Enters OTP → Logged in
4. Profile created with phone as primary ID
```

**Pros:**

- ✅ Fastest signup (30 seconds)
- ✅ No password to remember
- ✅ Works for less tech-savvy users
- ✅ Common in India (Swiggy, Zomato)
- ✅ Phone number verified by default

**Cons:**

- ❌ SMS costs (₹0.20-0.50 per OTP)
- ❌ OTP delays/failures (telecom issues)
- ❌ Users change numbers (account recovery issue)
- ❌ Can't login without phone network

**Cost Estimate:**

- 1000 signups/month = ₹500/month (SMS)
- 10,000 signups/month = ₹5,000/month

---

#### Option B: Email + Password (Traditional)

**How it works:**

```
1. User enters email + password
2. Receives verification email
3. Clicks link → Account verified
4. Login anytime with email/password
```

**Pros:**

- ✅ No SMS costs
- ✅ Works offline (remember password)
- ✅ Professional feel
- ✅ Email verified

**Cons:**

- ❌ Slower signup (2-3 minutes)
- ❌ Users forget passwords
- ❌ Need password reset flow
- ❌ Email might go to spam
- ❌ Less common in India for local services

---

#### Option C: Social Login (Google/Facebook)

**How it works:**

```
1. User clicks "Continue with Google"
2. Redirects to Google login
3. Returns with user info
4. Account created automatically
```

**Pros:**

- ✅ Ultra fast (one click)
- ✅ No password management
- ✅ Verified email from Google/Facebook
- ✅ Professional and modern
- ✅ User profile data available (name, photo)

**Cons:**

- ❌ Dependency on third-party
- ❌ Some users don't have Google/Facebook
- ❌ Privacy concerns (some users avoid)
- ❌ Need OAuth implementation

---

#### Option D: Multi-Method (Recommended for Yogic City)

**How it works:**

```
Signup options:
1. Phone number (OTP) → Primary for Indian users
2. Google Sign-In → For convenience
3. Email + Password → For those who prefer

All link to same account via unique user ID
```

**Implementation Priority:**

```
Phase 1 (MVP):
✓ Phone number (OTP) - MUST HAVE
✓ Google Sign-In - SHOULD HAVE

Phase 2:
✓ Email + Password
✓ Facebook Login
```

**Pros:**

- ✅ Maximum flexibility
- ✅ Users choose what they're comfortable with
- ✅ Multiple recovery options
- ✅ Better conversion (more signup options = more signups)

**Cons:**

- ❌ More code to maintain
- ❌ Need to handle account linking
- ❌ Complex edge cases (same email, different methods)

---

#### Option E: Magic Link (Passwordless Email)

**How it works:**

```
1. User enters email
2. Receives login link via email
3. Clicks link → Logged in
No password, no OTP
```

**Real Example:** Notion, Slack

**Pros:**

- ✅ No password to remember
- ✅ No SMS costs
- ✅ Secure (time-limited links)
- ✅ Modern UX

**Cons:**

- ❌ Requires email check every time
- ❌ Link expiry issues
- ❌ Not common in India yet
- ❌ Email delays

---

### Authentication Decision Matrix

| Method               | Indian Market Fit | Speed      | Cost       | Security   |
| -------------------- | ----------------- | ---------- | ---------- | ---------- |
| **Phone OTP**        | ⭐⭐⭐⭐⭐        | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     | ⭐⭐⭐⭐   |
| **Email + Password** | ⭐⭐⭐            | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| **Social Login**     | ⭐⭐⭐⭐          | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |
| **Multi-Method**     | ⭐⭐⭐⭐⭐        | ⭐⭐⭐⭐   | ⭐⭐⭐     | ⭐⭐⭐⭐   |
| **Magic Link**       | ⭐⭐              | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**💡 My Recommendation:** **Option D - Multi-Method** with this priority:

**MVP (Launch with these 2):**

1. **Phone OTP** (Primary) - via Twilio/MSG91
2. **Google Sign-In** (Secondary)

**Why Phone OTP as Primary?**

- Indian users expect it (Swiggy, Ola, Zomato all use it)
- Instant verification
- No email verification delays
- Works for everyone

**Why Google Sign-In as Secondary?**

- Free (no SMS cost)
- Faster for tech-savvy users
- Provides profile photo, name automatically
- Professional users prefer it

**Implementation Strategy:**

```javascript
// Pseudocode for user creation
const createUser = async (authMethod, credentials) => {
  let user;

  if (authMethod === 'phone') {
    // Verify OTP first
    const otpValid = await verifyOTP(credentials.phone, credentials.otp);
    if (!otpValid) throw new Error('Invalid OTP');

    // Create or find user
    user = await User.findOne({ phone: credentials.phone });
    if (!user) {
      user = await User.create({
        phone: credentials.phone,
        phoneVerified: true,
        authMethods: ['phone'],
      });
    }
  }

  if (authMethod === 'google') {
    // Verify Google token
    const googleUser = await verifyGoogleToken(credentials.token);

    // Check if user exists with this email
    user = await User.findOne({ email: googleUser.email });
    if (!user) {
      user = await User.create({
        email: googleUser.email,
        name: googleUser.name,
        profilePhoto: googleUser.picture,
        emailVerified: true,
        authMethods: ['google'],
      });
    } else {
      // Link Google to existing account
      if (!user.authMethods.includes('google')) {
        user.authMethods.push('google');
        await user.save();
      }
    }
  }

  return generateJWT(user);
};
```

**SMS Provider Recommendation:**

- **MSG91** (Indian, cheaper, reliable) - Primary
- **Twilio** (Global, expensive, very reliable) - Backup

---

## 4. Class Booking System Architecture

### Question: How should the booking flow work technically?

#### Option A: Instant Confirmation (No Instructor Approval)

**How it works:**

```
1. Student selects class & slot
2. Student pays
3. Booking confirmed immediately
4. Instructor notified
5. Both can cancel as per policy
```

**Pros:**

- ✅ Fastest user experience (1-2 minutes)
- ✅ Higher conversion (no waiting)
- ✅ Less work for instructor
- ✅ Automated revenue

**Cons:**

- ❌ Instructor might not want that student
- ❌ Can't handle special requests before confirming
- ❌ Slot could actually be unavailable (instructor blocked it manually)

**Best For:** Group classes, standardized offerings

---

#### Option B: Request & Approve (Instructor Control)

**How it works:**

```
1. Student requests booking (no payment yet)
2. Instructor reviews request
3. Instructor approves/rejects
4. If approved → Student pays
5. Booking confirmed
```

**Pros:**

- ✅ Instructor has full control
- ✅ Can discuss details before confirming
- ✅ Better for custom/private sessions
- ✅ Can screen students

**Cons:**

- ❌ Slow (24-48 hour wait)
- ❌ Student might book elsewhere
- ❌ Drop-off during waiting period
- ❌ More admin work for instructor

**Best For:** Private sessions, home visits, workshops

---

#### Option C: Hybrid (Recommended for Yogic City)

**How it works:**

```
Instructor decides per class:

Group Classes → Auto-confirm (Option A)
Private Sessions → Request & Approve (Option B)
Workshops → Auto-confirm with waitlist
```

**Example:**

```javascript
// Class model
const classSchema = new Schema({
  name: String,
  type: {
    type: String,
    enum: ['group', 'private', 'workshop'],
  },
  bookingMode: {
    type: String,
    enum: ['instant', 'approval'],
    default: function () {
      // Auto-set based on type
      return this.type === 'group' ? 'instant' : 'approval';
    },
  },
});
```

**Pros:**

- ✅ Flexibility for different scenarios
- ✅ Best user experience for each type
- ✅ Instructor can override defaults

**Cons:**

- ❌ More complex logic
- ❌ Need clear UI indicators ("Instant booking" vs "Request to book")

---

#### Option D: Smart Confirmation (AI/Rules-Based)

**How it works:**

```
System automatically approves/rejects based on:
- Student rating > 4.0 → Auto-approve
- First-time student → Request approval
- Student has cancellation history → Request approval
- Student is verified → Auto-approve
```

**Pros:**

- ✅ Balances speed and control
- ✅ Reduces instructor workload
- ✅ Protects from bad actors

**Cons:**

- ❌ Complex rules engine
- ❌ May still need instructor override
- ❌ Overkill for early stage

**Best For:** Mature platform with lots of data

---

### Booking Flow Technical Decisions

#### A. Race Condition Handling (Critical!)

**Problem:** Two students book the last slot simultaneously

**Solution Options:**

**Option 1: Optimistic Locking**

```javascript
// MongoDB: Use version field
const bookSlot = async (classId, slotId) => {
  const classDoc = await Class.findById(classId);

  if (classDoc.slots[slotId].booked >= classDoc.maxCapacity) {
    throw new Error('Slot full');
  }

  // Try to update only if version matches
  const result = await Class.updateOne(
    {
      _id: classId,
      __v: classDoc.__v,
      'slots.booked': { $lt: maxCapacity },
    },
    {
      $inc: { 'slots.booked': 1, __v: 1 },
    },
  );

  if (result.modifiedCount === 0) {
    throw new Error('Slot just got filled, please try again');
  }

  return true;
};
```

**Pros:** Handles concurrent bookings correctly
**Cons:** User might see "try again" message

---

**Option 2: Pessimistic Locking**

```javascript
// Lock the slot before booking
const bookSlot = async (classId, slotId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Lock the document
    const classDoc = await Class.findByIdAndUpdate(
      classId,
      { $inc: { 'slots.booked': 1 } },
      { session, new: true }
    );

    if (classDoc.slots.booked > classDoc.maxCapacity) {
      throw new Error('Slot full');
    }

    // Create booking
    const booking = await Booking.create([{...}], { session });

    await session.commitTransaction();
    return booking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
```

**Pros:** Prevents double booking completely
**Cons:** More complex, slower

**💡 Recommendation:** Use **Option 1** (simpler, good enough for early stage)

---

#### B. Booking Expiry (Hold Slot During Payment)

**Problem:** Student starts booking, slot shows "unavailable" to others, but student abandons payment

**Solution Options:**

**Option 1: No Hold**

- Slot remains available until payment confirms
- Risk: Two people complete payment simultaneously
- **Not Recommended**

**Option 2: Temporary Hold (5-10 minutes)**

```javascript
const initiateBooking = async (classId, slotId) => {
  // Create pending booking
  const booking = await Booking.create({
    classId,
    slotId,
    status: 'pending',
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
  });

  // Background job releases slot if not paid
  setTimeout(
    async () => {
      const b = await Booking.findById(booking._id);
      if (b.status === 'pending') {
        await b.remove();
        // Notify next person in waitlist
      }
    },
    10 * 60 * 1000,
  );

  return booking;
};
```

**Pros:** Prevents double booking, fair to users
**Cons:** Need background job management

**💡 Recommendation:** **Option 2** with **10-minute hold**

---

### Booking State Machine

```
[Available]
    ↓ (Student initiates)
[Held - 10 min]
    ↓ (Payment success)
[Confirmed]
    ↓ (Class happens)
[Completed]
    ↓ (Student rates)
[Closed]

Alternate paths:
[Held] →(timeout)→ [Released] → [Available]
[Confirmed] →(cancel)→ [Cancelled] → [Refund Processing]
```

**💡 My Recommendation for Yogic City:**

1. **MVP Approach:**
   - Group classes → Instant confirmation
   - Private sessions → Request & approve (24hr response time)
   - 10-minute payment hold
   - Optimistic locking for race conditions

2. **Technical Stack:**

   ```
   Booking API: Node.js + Express
   Database: MongoDB (with transactions)
   Queue: Bull (for background jobs)
   Locking: MongoDB version field
   Payment hold: 10 minutes
   ```

3. **Why This Approach:**
   - Simple enough for MVP
   - Handles edge cases
   - Scalable architecture
   - Standard patterns (easy for developers)

---

## 5. Payment Processing Strategy

### Question: How should payments flow through the system?

#### Option A: Direct Payment (Platform as Gateway)

**How it works:**

```
Student pays Yogic City → Razorpay
Yogic City holds money
Weekly settlement → Instructors
```

**Flow:**

```
Student: ₹500
   ↓ (Razorpay)
Yogic City Account: ₹500
   ↓ (Commission 15%)
Instructor receives: ₹425 (Friday)
Platform keeps: ₹75
```

**Pros:**

- ✅ Full control over payments
- ✅ Can hold refunds easily
- ✅ Clear commission deduction
- ✅ Better dispute handling
- ✅ Single Razorpay account

**Cons:**

- ❌ You hold customer money (liability)
- ❌ Need RBI approval for wallet (if holding > 24hrs)
- ❌ Trust issues (instructors worry about payment)
- ❌ Complex accounting

---

#### Option B: Split Payment (Razorpay Route/Transfer)

**How it works:**

```
Student pays → Razorpay splits automatically
₹425 → Instructor's account (instant)
₹75 → Yogic City account
```

**Technical:**

```javascript
// Razorpay Route API
const order = await razorpay.orders.create({
  amount: 50000, // ₹500 in paise
  currency: 'INR',
  transfers: [
    {
      account: instructorRazorpayAccountId,
      amount: 42500, // ₹425
      currency: 'INR',
      on_hold: 0, // Instant transfer
    },
  ],
});
```

**Pros:**

- ✅ Money goes directly to instructor
- ✅ No settlement delays
- ✅ Instructor trust (sees money immediately)
- ✅ Less liability for platform

**Cons:**

- ❌ Refunds complex (need to pull back from instructor)
- ❌ Each instructor needs Razorpay account
- ❌ More setup during onboarding
- ❌ Commission reversal on cancellation

---

#### Option C: Escrow System (Hold & Release)

**How it works:**

```
Student pays → Money held in escrow
Class happens → Money released to instructor
Class cancelled → Refund to student
```

**Timeline:**

```
Day 1: Booking → Payment held
Day 5: Class happens → Release to instructor (Day 6)
Day 7: If no complaint → Instructor can withdraw
```

**Pros:**

- ✅ Protects both parties
- ✅ Time for dispute resolution
- ✅ Industry standard for marketplaces
- ✅ Reduces fraud

**Cons:**

- ❌ Instructor waits for money
- ❌ Complex state management
- ❌ Need clear release triggers

---

#### Option D: Hybrid (Recommended)

**How it works:**

```
For established instructors (50+ classes, 4.5+ rating):
→ Instant split (Option B)

For new instructors:
→ Escrow with 7-day hold (Option C)

Platform always takes commission upfront
```

**Pros:**

- ✅ Builds trust gradually
- ✅ Protects platform from new instructor fraud
- ✅ Rewards good instructors

**Cons:**

- ❌ Complex implementation
- ❌ Need to explain two models

---

### Refund Strategy

#### Option 1: Platform Handles All Refunds

```javascript
const cancelBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId);

  // Calculate refund based on policy
  const refundAmount = calculateRefund(booking);

  // Initiate refund via Razorpay
  const refund = await razorpay.payments.refund(booking.paymentId, {
    amount: refundAmount,
  });

  // If money already transferred to instructor
  if (booking.paymentStatus === 'transferred') {
    // Deduct from next settlement
    await adjustInstructorBalance(booking.instructorId, -refundAmount);
  }

  booking.status = 'cancelled';
  booking.refundAmount = refundAmount;
  await booking.save();
};
```

**Pros:** Clean user experience
**Cons:** Complex if money already with instructor

---

#### Option 2: Instructor Approves Refunds

```
Student cancels → Refund request to instructor
Instructor approves → Money returned
Instructor rejects → Escalate to admin
```

**Pros:** Instructor control
**Cons:** Slow, poor UX

**💡 Recommendation:** **Option 1** with automated policy

---

### Payment Gateway Selection

| Feature             | Razorpay     | Paytm        | Instamojo  | PhonePe      |
| ------------------- | ------------ | ------------ | ---------- | ------------ |
| Transaction Fee     | 2% + ₹0      | 2% + ₹0      | 2% + ₹3    | 2% + ₹0      |
| Split Payment       | ✅ Yes       | ❌ No        | ❌ No      | ⚠️ Complex   |
| Instant Settlement  | ✅ Yes (T+0) | ⚠️ T+1       | ⚠️ T+1     | ⚠️ T+1       |
| UPI Support         | ✅ Excellent | ✅ Excellent | ✅ Good    | ✅ Excellent |
| International Cards | ✅ Yes       | ✅ Yes       | ❌ Limited | ❌ No        |
| Dashboard           | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐       |
| API Documentation   | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐       |
| Support             | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐       |

**💡 My Recommendation:** **Razorpay**

**Why?**

- Best split payment support (critical for your model)
- Excellent documentation and Node.js SDK
- T+0 settlement (instant if needed)
- Used by major Indian startups (Zomato, Swiggy)
- Superior dashboard and analytics

**Payment Flow for Yogic City:**

```javascript
// Recommended implementation
const createBookingWithPayment = async (bookingData) => {
  // 1. Create booking in pending state
  const booking = await Booking.create({
    ...bookingData,
    status: 'pending_payment',
    expiresAt: Date.now() + 600000, // 10 min
  });

  // 2. Create Razorpay order
  const order = await razorpay.orders.create({
    amount: bookingData.amount * 100, // Paise
    currency: 'INR',
    receipt: booking._id.toString(),
    notes: {
      bookingId: booking._id,
      instructorId: bookingData.instructorId,
      classId: bookingData.classId,
    },
  });

  booking.razorpay_order_id = order.id;
  await booking.save();

  return { booking, order };
};

// After payment success on frontend
const verifyAndConfirmBooking = async (paymentData) => {
  // 1. Verify signature
  const isValid = verifyRazorpaySignature(
    paymentData.razorpay_order_id,
    paymentData.razorpay_payment_id,
    paymentData.razorpay_signature,
  );

  if (!isValid) throw new Error('Payment verification failed');

  // 2. Update booking
  const booking = await Booking.findOne({
    razorpay_order_id: paymentData.razorpay_order_id,
  });

  booking.status = 'confirmed';
  booking.razorpay_payment_id = paymentData.razorpay_payment_id;
  booking.paidAt = new Date();
  await booking.save();

  // 3. Send confirmations
  await sendConfirmationEmail(booking);
  await sendConfirmationSMS(booking);
  await notifyInstructor(booking);

  return booking;
};
```

---

## 6. Search & Discovery Mechanism

### Question: How should students find the right instructor?

#### Option A: Simple Filter-Based Search

**How it works:**

```
Search bar + Filters:
- Location (city, area, distance)
- Yoga style (Hatha, Vinyasa, etc.)
- Price range (₹200-2000)
- Rating (3+, 4+, 4.5+)
- Availability (Morning, Evening)
```

**Pros:**

- ✅ Easy to implement
- ✅ Users understand it
- ✅ Fast queries

**Cons:**

- ❌ No personalization
- ❌ Results in random order
- ❌ Doesn't learn from user behavior

**MongoDB Query:**

```javascript
const searchInstructors = async (filters) => {
  const query = {};

  // Location filter (within radius)
  if (filters.location) {
    query['studio.location'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [filters.lng, filters.lat],
        },
        $maxDistance: filters.radius * 1000, // km to meters
      },
    };
  }

  // Yoga style
  if (filters.style) {
    query.specializations = filters.style;
  }

  // Price range
  if (filters.minPrice || filters.maxPrice) {
    query['classes.price'] = {
      $gte: filters.minPrice || 0,
      $lte: filters.maxPrice || 999999,
    };
  }

  // Rating
  if (filters.minRating) {
    query['rating.average'] = { $gte: filters.minRating };
  }

  return await Instructor.find(query).limit(20);
};
```

---

#### Option B: Weighted Scoring Algorithm

**How it works:**

```
Each instructor gets a score based on:
- Distance (closer = better)
- Rating (higher = better)
- Number of reviews (more = better)
- Response rate (faster = better)
- Booking rate (popular = better)
- Recency (active = better)

Sort by score descending
```

**Scoring Formula:**

```javascript
const calculateScore = (instructor, userLocation) => {
  const weights = {
    distance: 0.3,
    rating: 0.25,
    reviews: 0.15,
    responseTime: 0.1,
    bookingRate: 0.1,
    recency: 0.1,
  };

  // Distance score (inverse)
  const distance = calculateDistance(instructor.location, userLocation);
  const distanceScore = Math.max(0, 1 - distance / 50); // 50km max

  // Rating score (normalized)
  const ratingScore = instructor.rating.average / 5;

  // Review count score (logarithmic)
  const reviewScore = Math.log10(instructor.rating.count + 1) / 3;

  // Response time score
  const responseScore =
    instructor.avgResponseTime < 120
      ? 1
      : instructor.avgResponseTime < 240
        ? 0.7
        : 0.4;

  // Booking rate (last 30 days)
  const bookingScore = Math.min(1, instructor.bookingsLast30Days / 50);

  // Recency score
  const daysSinceActive =
    (Date.now() - instructor.lastActive) / (1000 * 60 * 60 * 24);
  const recencyScore =
    daysSinceActive < 7 ? 1 : daysSinceActive < 30 ? 0.5 : 0.2;

  // Weighted total
  return (
    (distanceScore * weights.distance +
      ratingScore * weights.rating +
      reviewScore * weights.reviews +
      responseScore * weights.responseTime +
      bookingScore * weights.bookingRate +
      recencyScore * weights.recency) *
    100
  );
};
```

**Pros:**

- ✅ Better quality results
- ✅ Balances multiple factors
- ✅ Promotes active instructors

**Cons:**

- ❌ More complex
- ❌ Need to maintain metrics
- ❌ Heavier computation

---

#### Option C: Elasticsearch-Based Search

**How it works:**

```
Index instructors in Elasticsearch
Full-text search on:
- Name, bio, specializations
- Location (geo queries)
- Fuzzy matching
- Relevance scoring
```

**Example:**

```javascript
const searchWithElasticsearch = async (query) => {
  const result = await esClient.search({
    index: 'instructors',
    body: {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: query.text,
                fields: ['name^3', 'bio', 'specializations^2'],
                fuzziness: 'AUTO',
              },
            },
          ],
          filter: [
            {
              geo_distance: {
                distance: `${query.radius}km`,
                location: {
                  lat: query.lat,
                  lon: query.lon,
                },
              },
            },
            {
              range: {
                'rating.average': { gte: query.minRating || 0 },
              },
            },
          ],
        },
      },
      sort: [{ _score: 'desc' }, { 'rating.average': 'desc' }],
    },
  });

  return result.hits.hits.map((hit) => hit._source);
};
```

**Pros:**

- ✅ Lightning fast
- ✅ Advanced features (autocomplete, suggestions)
- ✅ Scales extremely well
- ✅ Powerful full-text search

**Cons:**

- ❌ Additional service to manage
- ❌ Sync issues (MongoDB → Elasticsearch)
- ❌ Overkill for early stage
- ❌ Higher infrastructure cost

---

#### Option D: Personalized Recommendations (ML-Based)

**How it works:**

```
Based on user's:
- Past bookings
- Saved instructors
- Profile preferences
- Similar users' choices

Recommend instructors they'd likely book
```

**Approaches:**

**Simple:** Collaborative Filtering

```javascript
// Users who booked instructor A also booked B
const getRecommendations = async (userId) => {
  // Get user's booked instructors
  const userBookings = await Booking.find({
    studentId: userId,
  }).distinct('instructorId');

  // Find users with similar bookings
  const similarUsers = await Booking.aggregate([
    { $match: { instructorId: { $in: userBookings } } },
    { $group: { _id: '$studentId', count: { $sum: 1 } } },
    { $match: { count: { $gte: 2 } } }, // At least 2 common
    { $sort: { count: -1 } },
    { $limit: 50 },
  ]);

  // Get instructors these similar users booked
  const recommendations = await Booking.aggregate([
    {
      $match: {
        studentId: { $in: similarUsers.map((u) => u._id) },
        instructorId: { $nin: userBookings }, // Exclude already booked
      },
    },
    { $group: { _id: '$instructorId', score: { $sum: 1 } } },
    { $sort: { score: -1 } },
    { $limit: 10 },
  ]);

  return recommendations;
};
```

**Pros:**

- ✅ Highly relevant
- ✅ Increases bookings
- ✅ Better user experience

**Cons:**

- ❌ Needs data (cold start problem)
- ❌ Complex to build and maintain
- ❌ Not needed at early stage

---

### Search Strategy Decision Matrix

| Approach               | Early Stage | Performance | User Experience | Complexity |
| ---------------------- | ----------- | ----------- | --------------- | ---------- |
| **Simple Filters**     | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐    | ⭐⭐⭐          | ⭐⭐⭐⭐⭐ |
| **Weighted Scoring**   | ⭐⭐⭐⭐    | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐      | ⭐⭐⭐⭐   |
| **Elasticsearch**      | ⭐⭐        | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐      | ⭐⭐       |
| **ML Recommendations** | ⭐          | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐      | ⭐         |

**💡 My Recommendation:** **Phased Approach**

**Phase 1 (MVP):** Simple Filters + Basic Sorting

```javascript
// Simple but effective
const search = async (filters) => {
  const query = buildFilterQuery(filters);

  return await Instructor.find(query)
    .sort({
      'rating.average': -1, // Best rated first
      'rating.count': -1, // Most reviewed second
    })
    .limit(20);
};
```

**Phase 2 (Month 3-6):** Add Weighted Scoring

```javascript
// Calculate scores in aggregation pipeline
const search = async (filters) => {
  return await Instructor.aggregate([
    { $match: buildFilterQuery(filters) },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ['$rating.average', 20] },
            { $multiply: [{ $log10: { $add: ['$rating.count', 1] } }, 10] },
            { $cond: [{ $lt: ['$avgResponseTime', 120] }, 20, 5] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: 20 },
  ]);
};
```

**Phase 3 (Year 2):** ML Recommendations

**Why This Approach?**

- Start simple, iterate based on data
- Don't over-engineer early
- Add complexity when it adds value
- Weighted scoring gives 80% of benefit with 20% of complexity

---

## 7. Communication System

### Question: How should users communicate with each other?

#### Option A: SMS/Email Only (No In-App Chat)

**How it works:**

```
- Students send inquiries via platform
- Platform forwards to instructor's email/SMS
- Instructor replies via email
- No real-time chat
```

**Pros:**

- ✅ Zero implementation effort
- ✅ Uses existing channels
- ✅ No moderation needed

**Cons:**

- ❌ Poor user experience
- ❌ Leaves platform (hard to track)
- ❌ Slow communication
- ❌ Unprofessional

**Verdict:** ❌ Not recommended for modern platform

---

#### Option B: In-App Messaging (Asynchronous)

**How it works:**

```
- Built-in chat interface
- Send/receive messages
- Messages stored in database
- Email/push notifications for new messages
- Like WhatsApp but within platform
```

**Technical:**

```javascript
// Message model
const messageSchema = new Schema({
  conversationId: ObjectId,
  senderId: ObjectId,
  senderType: { type: String, enum: ['student', 'instructor'] },
  receiverId: ObjectId,
  messageText: String,
  attachments: [String],
  readAt: Date,
  createdAt: { type: Date, default: Date.now },
});

// Conversation model
const conversationSchema = new Schema({
  studentId: ObjectId,
  instructorId: ObjectId,
  bookingId: ObjectId, // Optional, if related to booking
  lastMessage: String,
  lastMessageAt: Date,
  unreadCount: {
    student: Number,
    instructor: Number,
  },
});
```

**Pros:**

- ✅ Professional experience
- ✅ Keeps users on platform
- ✅ Can moderate if needed
- ✅ Track engagement
- ✅ Easier customer support

**Cons:**

- ❌ Development effort
- ❌ Need notification system
- ❌ Storage costs

---

#### Option C: Real-Time Chat (WebSocket)

**How it works:**

```
- Socket.io for real-time
- Messages appear instantly
- Online/offline status
- Typing indicators
- Like Telegram/WhatsApp
```

**Technical:**

```javascript
// Socket.io setup
io.on('connection', (socket) => {
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('send-message', async (data) => {
    // Save to database
    const message = await Message.create({
      conversationId: data.conversationId,
      senderId: socket.userId,
      messageText: data.text,
    });

    // Emit to other user
    io.to(data.conversationId).emit('new-message', message);

    // Send push notification if other user offline
    if (!isUserOnline(data.receiverId)) {
      sendPushNotification(data.receiverId, message);
    }
  });

  socket.on('typing', (conversationId) => {
    socket.to(conversationId).emit('user-typing', socket.userId);
  });
});
```

**Pros:**

- ✅ Best user experience
- ✅ Modern and professional
- ✅ Real-time engagement
- ✅ Competitive advantage

**Cons:**

- ❌ Complex to implement
- ❌ Need WebSocket infrastructure
- ❌ Harder to scale
- ❌ More monitoring required

---

#### Option D: Hybrid (Recommended)

**How it works:**

```
MVP: Asynchronous in-app messaging (Option B)
Phase 2: Add real-time features (Option C)
```

**Why?**

- Get basic communication quickly
- Upgrade to real-time later
- Most conversations don't need real-time
- Can use REST API initially, add WebSocket later

---

### Message Moderation Strategy

**Question:** Should you moderate messages?

#### Option 1: No Moderation

**Pros:** Simple
**Cons:** Risk of abuse, spam, harassment

#### Option 2: AI + Human Moderation

```javascript
const sendMessage = async (messageData) => {
  // 1. Check for profanity/spam
  const isSafe = await checkMessageSafety(messageData.text);

  if (!isSafe) {
    // Flag for admin review
    await flagMessage(messageData);
    throw new Error('Message contains inappropriate content');
  }

  // 2. Rate limiting (prevent spam)
  const recentMessages = await Message.countDocuments({
    senderId: messageData.senderId,
    createdAt: { $gte: Date.now() - 60000 }, // Last minute
  });

  if (recentMessages > 10) {
    throw new Error('Too many messages, please slow down');
  }

  // 3. Save message
  return await Message.create(messageData);
};
```

**💡 Recommendation:**

- Start with basic profanity filter + rate limiting
- Add human moderation only if issues arise
- Don't over-moderate (users hate it)

---

### Quick Reply Templates

**Feature:** Pre-written messages for instructors

```javascript
const quickReplies = [
  'Thank you for your interest! I have availability this week.',
  'Yes, I provide yoga mats and all props.',
  'Please arrive 10 minutes early for check-in.',
  'My studio has parking available.',
  'I offer both group and private sessions.',
  'Let me check my schedule and get back to you.',
];
```

**Pros:**

- ✅ Faster instructor responses
- ✅ Professional consistency
- ✅ Reduces typos

**Implementation:** Simple dropdown in chat UI

---

**💡 Final Communication Recommendation:**

**MVP (Launch):**

```
Feature: Asynchronous in-app messaging
Tech: REST API + MongoDB
Notifications: Email + SMS (via existing providers)
Moderation: Basic profanity filter + rate limiting
Extras: Quick reply templates for instructors
```

**Phase 2 (Month 6):**

```
Add: Real-time chat via Socket.io
Add: Online/offline status
Add: Typing indicators
Add: Read receipts
Add: Message attachments (images)
```

**Why?**

- MVP gives 80% of value with 20% effort
- Users won't notice lack of real-time initially
- Can launch faster
- Upgrade path is clear

---

## 8. Review & Rating System

### Question: How should the review system work?

#### Option A: Simple Star Rating Only

**What users do:**

- Rate instructor 1-5 stars
- No written review required
- Quick and easy

**Pros:**

- ✅ Very fast for users (2 seconds)
- ✅ High completion rate
- ✅ Simple to implement

**Cons:**

- ❌ No context (why 3 stars?)
- ❌ Less helpful for other users
- ❌ Harder for instructors to improve

---

#### Option B: Detailed Review System (Recommended)

**What users provide:**

```
1. Overall rating (1-5 stars) - REQUIRED
2. Category ratings - OPTIONAL
   - Teaching quality
   - Communication
   - Studio environment
   - Value for money
3. Quick tags - SELECT MULTIPLE
   [Beginner friendly] [Patient teacher] [Clean studio]
   [Great atmosphere] [Punctual] [Professional]
4. Written review (50-500 chars) - OPTIONAL
5. Photos - OPTIONAL (up to 3)
```

**Pros:**

- ✅ Rich feedback for instructors
- ✅ Helpful for future students
- ✅ Better decision-making data
- ✅ Builds trust

**Cons:**

- ❌ Lower completion rate (more effort)
- ❌ More UI/UX work

**💡 Solution:** Make only overall rating required, rest optional

---

#### Option C: Verified Reviews Only

**Rule:** Can only review if you actually attended the class

**Verification:**

```javascript
const canUserReview = async (userId, bookingId) => {
  const booking = await Booking.findById(bookingId);

  // Checks:
  if (booking.studentId !== userId) return false;
  if (booking.status !== 'completed') return false;
  if (!booking.attendance.marked) return false;
  if (!booking.attendance.present) return false;
  if (booking.reviewSubmitted) return false; // Already reviewed

  return true;
};
```

**Pros:**

- ✅ Authentic reviews only
- ✅ Prevents fake reviews
- ✅ Higher trust

**Cons:**

- ❌ Fewer reviews (only attended classes)

**💡 Verdict:** This is a must-have, not optional

---

### Review Timing Strategy

**Question:** When should you ask for a review?

#### Option 1: Immediately After Class

```
Trigger: Class end time + 15 minutes
Notification: "How was your class with Priya?"
```

**Pros:**

- ✅ Fresh in memory
- ✅ Emotional response (good or bad)
- ✅ Higher completion rate

**Cons:**

- ❌ Might be rushed/still in class
- ❌ Less thoughtful

---

#### Option 2: Next Day

```
Trigger: Class end time + 24 hours
Notification: "How did you feel after yesterday's yoga class?"
```

**Pros:**

- ✅ User has processed the experience
- ✅ Can evaluate post-class feeling
- ✅ More thoughtful reviews

**Cons:**

- ❌ Lower response rate (people forget)
- ❌ Less emotional

---

#### Option 3: Progressive Prompts (Recommended)

```
1st prompt: 30 min after class (in-app banner)
2nd prompt: 24 hours later (push notification)
3rd prompt: 3 days later (email) - final reminder
```

**Pros:**

- ✅ Multiple chances to review
- ✅ Catches users at different times
- ✅ Balances immediacy and thoughtfulness

**Cons:**

- ❌ Can feel spammy (limit to 3 prompts)

---

### Instructor Reply to Reviews

**Should instructors be able to reply?**

**Option A: No Replies**

- Reviews stand alone
- Simple

**Option B: Replies Allowed (Recommended)**

```javascript
const reviewSchema = new Schema({
  // ... review fields
  instructorReply: {
    text: String,
    repliedAt: Date,
  },
});

// Rules:
// 1. One reply per review
// 2. Can't edit reply after 24 hours
// 3. Must be professional (flagged if abusive)
```

**Why Allow Replies?**

- ✅ Shows instructor cares
- ✅ Can clarify misunderstandings
- ✅ Demonstrates professionalism
- ✅ Can turn negative into positive

**Example:**

```
Review (3 stars): "Class was good but started 10 minutes late."

Instructor Reply: "Thank you for your feedback. I sincerely
apologize for the delay - there was an unexpected issue with
the studio entrance. I've taken steps to ensure this doesn't
happen again. I hope to welcome you back soon!"
```

---

### Review Display Strategy

**Question:** How should reviews be displayed?

#### Option A: Chronological (Latest First)

```
Sort by: createdAt DESC
```

**Pros:** Simple, shows recent experience
**Cons:** Good reviews might be buried

---

#### Option B: Highest Rated First

```
Sort by: rating DESC, createdAt DESC
```

**Pros:** Shows best reviews first
**Cons:** Feels manipulated, hides problems

---

#### Option C: Most Helpful First (Recommended)

```javascript
const getReviews = async (instructorId, sortBy = 'helpful') => {
  let sort;

  if (sortBy === 'helpful') {
    sort = { helpfulCount: -1, createdAt: -1 };
  } else if (sortBy === 'recent') {
    sort = { createdAt: -1 };
  } else if (sortBy === 'rating_high') {
    sort = { rating: -1, createdAt: -1 };
  } else if (sortBy === 'rating_low') {
    sort = { rating: 1, createdAt: -1 };
  }

  return await Review.find({ instructorId }).sort(sort);
};
```

**Let users vote "helpful":**

```
[👍 Helpful (12)]  // Other users found this useful
```

**Pros:**

- ✅ Most useful reviews surface
- ✅ Community-driven
- ✅ Fair to instructors

---

### Review Moderation

**What to moderate?**

```javascript
const reviewModerationChecks = {
  // Auto-reject
  profanity: true, // Bad words
  personalInfo: true, // Phone numbers, emails
  externalLinks: true, // URLs

  // Flag for review
  allCaps: true, // SHOUTING
  repeatedChars: true, // "badddddd"
  veryShort: true, // Less than 10 chars
  suspiciousPatterns: true, // Spam patterns

  // Allow
  constructiveCriticism: true, // Negative but specific
  detailedFeedback: true, // Helpful detail
};
```

**💡 Recommendation:**

- Auto-filter obvious spam/profanity
- Flag suspicious reviews for manual check
- Don't over-moderate (allow negative reviews if legitimate)
- Instructors can dispute, admin decides

---

**💡 Final Review System Recommendation:**

```javascript
const reviewSystem = {
  // What to collect
  rating: {
    overall: 'required',
    categories: 'optional',
    tags: 'optional',
    written: 'optional (encouraged)',
    photos: 'optional',
  },

  // Verification
  canReview: 'verified bookings only',
  oneReviewPerBooking: true,

  // Timing
  prompts: ['30min', '24hours', '3days'],

  // Display
  defaultSort: 'most helpful',
  allowFiltering: true,

  // Instructor interaction
  allowReplies: true,
  oneReplyMax: true,

  // Moderation
  autoFilter: ['profanity', 'spam'],
  humanReview: ['flagged', 'disputed'],

  // Gamification
  helpfulVoting: true,
  reviewerBadges: true, // "Helpful Reviewer" badge
};
```

---

## 9. Notification Strategy

### Question: How should users be notified?

### Notification Channels

#### Channel A: Email

**Pros:**

- ✅ Free (after setup)
- ✅ Rich formatting (HTML)
- ✅ Can include lots of info
- ✅ Users check regularly

**Cons:**

- ❌ Not immediate
- ❌ Might go to spam
- ❌ Lower open rates (~20-30%)

**Best For:** Confirmations, receipts, newsletters

---

#### Channel B: SMS

**Pros:**

- ✅ Instant delivery
- ✅ High open rate (~98%)
- ✅ Works on any phone
- ✅ No app needed

**Cons:**

- ❌ Costs money (₹0.20-0.50 per SMS)
- ❌ Character limit (160 chars)
- ❌ No rich formatting

**Cost Calculation:**

```
1000 users × 5 SMS/month = 5000 SMS
5000 × ₹0.30 = ₹1,500/month
```

**Best For:** OTP, urgent reminders, confirmations

---

#### Channel C: Push Notifications (Mobile App)

**Pros:**

- ✅ Free (after app)
- ✅ Instant
- ✅ Rich UI (images, actions)
- ✅ High visibility

**Cons:**

- ❌ Requires mobile app
- ❌ Users must enable permissions
- ❌ Can be ignored/dismissed

**Best For:** All notifications (once app exists)

---

#### Channel D: In-App Notifications

**Pros:**

- ✅ Free
- ✅ Part of platform experience
- ✅ Can be detailed

**Cons:**

- ❌ Only when user is on platform
- ❌ Easy to miss

**Best For:** Non-urgent updates, social interactions

---

### Notification Priority Matrix

| Event                   | SMS | Email | Push | In-App |
| ----------------------- | --- | ----- | ---- | ------ |
| **OTP for login**       | ✅  | ❌    | ❌   | ❌     |
| **Booking confirmed**   | ✅  | ✅    | ✅   | ✅     |
| **Class in 2 hours**    | ✅  | ❌    | ✅   | ❌     |
| **Class cancelled**     | ✅  | ✅    | ✅   | ✅     |
| **Payment received**    | ❌  | ✅    | ✅   | ✅     |
| **New message**         | ❌  | ❌    | ✅   | ✅     |
| **Review received**     | ❌  | ✅    | ✅   | ✅     |
| **Weekly summary**      | ❌  | ✅    | ❌   | ❌     |
| **Promotional offer**   | ❌  | ✅    | ⚠️   | ✅     |
| **Instructor approved** | ❌  | ✅    | ❌   | ✅     |
| **Refund processed**    | ✅  | ✅    | ✅   | ✅     |

---

### Notification Timing Strategy

**Question:** When to send notifications?

#### Strategy A: Immediate

```
Event happens → Notification sent instantly
```

**Good For:** Confirmations, urgent updates, OTPs
**Bad For:** Non-urgent, batch updates

---

#### Strategy B: Batched (Digest)

```
Collect events → Send once daily/weekly
Example: "You have 5 new messages today"
```

**Good For:** Low-priority updates, summaries
**Bad For:** Time-sensitive info

---

#### Strategy C: Smart Timing (Recommended)

```javascript
const notificationRules = {
  booking_confirmed: {
    channels: ['sms', 'email', 'push'],
    timing: 'immediate',
  },

  class_reminder: {
    channels: ['sms', 'push'],
    timing: [
      { before: '24 hours', channels: ['email', 'push'] },
      { before: '2 hours', channels: ['sms', 'push'] },
    ],
  },

  new_message: {
    channels: ['push', 'in-app'],
    timing: 'immediate',
    quiet_hours: { start: '22:00', end: '08:00' },
  },

  weekly_summary: {
    channels: ['email'],
    timing: 'every Monday 9 AM',
  },
};
```

**Pros:**

- ✅ Right message, right time, right channel
- ✅ Not overwhelming
- ✅ Respects user preferences

---

### User Notification Preferences

**Should users control notifications?**

**Yes! Preference System:**

```javascript
const userNotificationPrefs = {
  userId: ObjectId,

  email: {
    bookingConfirmations: true,
    reminders: true,
    messages: false,
    marketing: true,
    weeklyDigest: true,
  },

  sms: {
    bookingConfirmations: true,
    reminders: true,
    messages: false,
    marketing: false,
  },

  push: {
    bookingConfirmations: true,
    reminders: true,
    messages: true,
    marketing: false,
  },

  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00',
  },
};
```

**Implementation:**

```javascript
const shouldSendNotification = (userId, type, channel) => {
  const prefs = await getUserPreferences(userId);

  // Check if user wants this type on this channel
  if (!prefs[channel][type]) return false;

  // Check quiet hours (except urgent notifications)
  if (prefs.quietHours.enabled && !isUrgent(type)) {
    const now = new Date();
    const currentHour = now.getHours();
    const quietStart = parseInt(prefs.quietHours.start);
    const quietEnd = parseInt(prefs.quietHours.end);

    if (currentHour >= quietStart || currentHour < quietEnd) {
      return false; // In quiet hours
    }
  }

  return true;
};
```

---

**💡 My Notification Recommendation for Yogic City:**

**MVP (Launch):**

```javascript
const mvpNotifications = {
  channels: {
    sms: 'Twilio/MSG91 (for OTP + critical)',
    email: 'SendGrid (for confirmations + receipts)',
    inApp: 'Simple badge counter',
  },

  events: [
    'OTP for login → SMS',
    'Booking confirmed → SMS + Email',
    'Class in 2 hours → SMS',
    'Class cancelled → SMS + Email',
    'Refund processed → Email',
    'Payment received (instructor) → Email',
  ],

  preferences: 'Basic on/off toggle in settings',

  cost_estimate: '₹2,000-3,000/month for 1000 active users',
};
```

**Phase 2 (Month 3-6):**

```javascript
const phase2Additions = {
  channels: {
    push: 'Firebase Cloud Messaging (mobile app)',
  },

  events: [
    'New message → Push',
    'Review received → Push + Email',
    'Instructor replied → Push',
    'Weekly earnings summary → Email (Sunday)',
    'Promotional offers → Email (opt-in only)',
  ],

  preferences: 'Granular control per event type',
  quietHours: true,
  smartTiming: true,
};
```

---

## 10. File Storage & Media

### Question: Where should files be stored?

#### Option A: Local Server Storage

**How it works:**

```
Files uploaded → Saved to server disk
Example: /uploads/profiles/user123.jpg
```

**Pros:**

- ✅ Simple to implement
- ✅ No external dependency
- ✅ No additional cost

**Cons:**

- ❌ Disk space limited
- ❌ No CDN (slow for users far away)
- ❌ Lost if server crashes
- ❌ Hard to scale (multiple servers)

**Verdict:** ❌ Not recommended for production

---

#### Option B: AWS S3 (Recommended)

**How it works:**

```
Files uploaded → Sent to AWS S3
S3 provides URL → Save URL in database
User requests image → Served from S3
```

**Pros:**

- ✅ Unlimited storage
- ✅ High reliability (99.999999999% durability)
- ✅ CDN integration (CloudFront)
- ✅ Image transformations (resize, compress)
- ✅ Industry standard

**Cons:**

- ❌ Monthly cost ($0.023/GB + data transfer)
- ❌ More complex setup

**Cost Estimate:**

```
1000 instructors × 5 images × 2MB = 10GB
Storage: 10GB × $0.023 = $0.23/month
Data Transfer: Minimal (images cached)
Total: ~$5-10/month initially
```

---

#### Option C: Cloudinary (Best for Images)

**How it works:**

```
Upload image → Cloudinary
Automatic optimization + transformations
CDN delivery
```

**Features:**

```javascript
// Cloudinary transformations
const profileUrl = cloudinary.url('profile.jpg', {
  width: 400,
  height: 400,
  crop: 'fill',
  gravity: 'face',
  quality: 'auto',
  fetch_format: 'auto',
});
// Returns optimized, resized, WebP image
```

**Pros:**

- ✅ Image optimization automatic
- ✅ Multiple sizes on-the-fly
- ✅ Face detection, smart cropping
- ✅ Video support
- ✅ Free tier (25GB storage, 25GB bandwidth)

**Cons:**

- ❌ Expensive after free tier
- ❌ Vendor lock-in

**Free Tier Limits:**

```
Storage: 25GB (good for ~5000 instructor profiles)
Bandwidth: 25GB/month (good for ~50,000 image views)
Transformations: 25,000/month
```

---

#### Option D: Hybrid Approach

**Strategy:**

```
User-uploaded images → Cloudinary (profiles, studio photos)
System files (PDFs, certificates) → AWS S3
Temporary files → Local server
```

**Why?**

- Images need optimization → Cloudinary better
- Documents don't need transformation → S3 cheaper
- Best of both worlds

---

### File Upload Implementation

```javascript
// Multer for handling uploads
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Memory storage (not saving to disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  },
});

// Upload endpoint
app.post('/api/upload/profile', upload.single('image'), async (req, res) => {
  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        {
          folder: 'yogic-city/profiles',
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) throw error;

          // Save URL to database
          User.findByIdAndUpdate(req.user.id, {
            profilePhoto: result.secure_url,
          });

          res.json({ url: result.secure_url });
        },
      )
      .end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

**💡 My File Storage Recommendation:**

```javascript
const storageStrategy = {
  // Phase 1 (MVP)
  provider: 'Cloudinary Free Tier',

  files: {
    profilePhotos: {
      destination: 'cloudinary',
      maxSize: '5MB',
      formats: ['jpg', 'png', 'webp'],
      transformations: {
        thumbnail: { width: 150, height: 150, crop: 'fill' },
        profile: { width: 500, height: 500, crop: 'fill' },
        original: { quality: 'auto', fetch_format: 'auto' },
      },
    },

    studioPhotos: {
      destination: 'cloudinary',
      maxSize: '5MB',
      count: 'max 10 per instructor',
      transformations: {
        thumbnail: { width: 300, height: 200 },
        large: { width: 1200, quality: 80 },
      },
    },

    certificates: {
      destination: 'cloudinary', // Use S3 if free tier exhausted
      maxSize: '10MB',
      formats: ['jpg', 'png', 'pdf'],
    },
  },

  // Phase 2 (if exceeding free tier)
  upgrade: {
    to: 'AWS S3 + CloudFront CDN',
    reason: 'More cost-effective at scale',
    migration: 'Gradual (old images stay on Cloudinary)',
  },
};
```

**Why Cloudinary for MVP?**

- Free tier is generous
- Zero config image optimization
- Fast CDN delivery
- Easy to implement
- Can always migrate to S3 later

---

## 11. API Architecture Pattern

### Question: How should the API be structured?

#### Option A: RESTful API (Traditional)

**Structure:**

```
GET    /api/instructors          - List instructors
GET    /api/instructors/:id      - Get one instructor
POST   /api/instructors          - Create instructor
PUT    /api/instructors/:id      - Update instructor
DELETE /api/instructors/:id      - Delete instructor

GET    /api/bookings             - List bookings
POST   /api/bookings             - Create booking
GET    /api/bookings/:id         - Get booking
PUT    /api/bookings/:id/cancel  - Cancel booking
```

**Pros:**

- ✅ Standard and well-understood
- ✅ Cacheable (GET requests)
- ✅ Stateless
- ✅ Works with any client

**Cons:**

- ❌ Multiple requests for related data (N+1 problem)
- ❌ Over-fetching (get more data than needed)
- ❌ Under-fetching (need multiple calls)

---

#### Option B: GraphQL

**How it works:**

```graphql
query {
  instructor(id: "123") {
    name
    rating
    classes {
      name
      price
      nextAvailable
    }
    reviews(limit: 5) {
      rating
      text
      student {
        name
      }
    }
  }
}
```

**Pros:**

- ✅ Get exactly what you need (no over/under fetching)
- ✅ Single endpoint
- ✅ Self-documenting (schema)
- ✅ Modern and flexible

**Cons:**

- ❌ More complex to implement
- ❌ Caching is harder
- ❌ Overkill for simple CRUD
- ❌ Learning curve for team

---

#### Option C: REST + Custom Endpoints (Recommended)

**Hybrid approach:**

```javascript
// Standard REST
GET  /api/instructors
GET  /api/instructors/:id

// Custom endpoints for complex queries
GET  /api/search/instructors?lat=22.7&lng=75.8&radius=10&style=hatha
GET  /api/instructors/:id/availability?date=2025-12-20
POST /api/bookings/:id/complete
GET  /api/dashboard/instructor  // Returns everything for dashboard

// Nested resources when it makes sense
GET  /api/instructors/:id/classes
GET  /api/instructors/:id/reviews
GET  /api/classes/:id/slots
```

**Pros:**

- ✅ RESTful where it makes sense
- ✅ Custom endpoints for complex operations
- ✅ Optimized queries for specific use cases
- ✅ Easy to understand and maintain

**Cons:**

- ❌ Less "pure" REST
- ❌ More endpoints to document

---

### API Response Format

**Question:** How should responses be structured?

#### Standard Format:

```javascript
// Success response
{
  success: true,
  data: {
    instructor: {
      id: "123",
      name: "Priya Verma",
      rating: 4.8
    }
  },
  message: "Instructor fetched successfully" // optional
}

// Error response
{
  success: false,
  error: {
    code: "INSTRUCTOR_NOT_FOUND",
    message: "Instructor with ID 123 not found",
    details: {} // optional, for validation errors
  }
}

// List response (with pagination)
{
  success: true,
  data: {
    instructors: [...],
    pagination: {
      page: 1,
      limit: 20,
      total: 156,
      pages: 8,
      hasNext: true,
      hasPrev: false
    }
  }
}
```

---

### API Versioning

**Question:** Should APIs be versioned?

#### Option A: No Versioning

```
/api/instructors
```

**Pros:** Simple
**Cons:** Breaking changes affect all clients

---

#### Option B: URL Versioning (Recommended for MVP)

```
/api/v1/instructors
/api/v2/instructors
```

**Pros:**

- ✅ Clear and explicit
- ✅ Can maintain multiple versions
- ✅ Easy to deprecate old versions

**Cons:**

- ❌ URL changes when version changes

---

#### Option C: Header Versioning

```
GET /api/instructors
Header: API-Version: 2
```

**Pros:** Clean URLs
**Cons:** Harder to test/debug

---

**💡 My API Recommendation:**

```javascript
const apiStructure = {
  // Base
  baseUrl: 'https://api.yogiccity.com',
  version: 'v1',

  // Authentication
  auth: {
    method: 'JWT Bearer Token',
    header: 'Authorization: Bearer <token>',
  },

  // Response format
  standardResponse: true,

  // Rate limiting
  rateLimit: {
    authenticated: '100 requests/minute',
    unauthenticated: '20 requests/minute',
  },

  // Pagination
  defaultLimit: 20,
  maxLimit: 100,

  // Error codes
  errorCodes: {
    400: 'Bad Request (validation error)',
    401: 'Unauthorized (invalid token)',
    403: 'Forbidden (no permission)',
    404: 'Not Found',
    409: 'Conflict (duplicate)',
    429: 'Too Many Requests (rate limit)',
    500: 'Internal Server Error',
  },

  // Documentation
  docs: 'Swagger/OpenAPI auto-generated',
};
```

**Example Implementation:**

```javascript
// Express API structure
const express = require('express');
const router = express.Router();

// Middleware
router.use(authenticate); // Verify JWT
router.use(rateLimit); // Prevent abuse

// Standard REST endpoints
router.get('/instructors', listInstructors);
router.get('/instructors/:id', getInstructor);
router.post('/instructors', createInstructor);
router.put('/instructors/:id', updateInstructor);
router.delete('/instructors/:id', deleteInstructor);

// Custom endpoints
router.get('/search/instructors', searchInstructors);
router.get('/instructors/:id/dashboard', getInstructorDashboard);
router.post('/bookings/:id/confirm', confirmBooking);

// Error handler
router.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message,
      details: err.details || {},
    },
  });
});

module.exports = router;
```

---

## 12. Database Schema Design Philosophy

### Question: How should data be organized in MongoDB?

#### Approach A: Highly Normalized (SQL-style)

**Structure:**

```javascript
// Separate collection for everything
Users { _id, name, email, phone }
Instructors { _id, userId, bio, experience }
Studios { _id, instructorId, name, address }
Classes { _id, instructorId, name, duration }
Bookings { _id, classId, studentId, date }
Reviews { _id, bookingId, instructorId, rating }
```

**Pros:**

- ✅ No data duplication
- ✅ Easy to update (one place)
- ✅ Consistent data

**Cons:**

- ❌ Many JOINs ($lookup in MongoDB)
- ❌ Slower queries
- ❌ Complex aggregations

---

#### Approach B: Denormalized (Embed Everything)

**Structure:**

```javascript
Instructors {
  _id,
  name,
  email,
  bio,
  studio: { name, address, photos },
  classes: [
    { name, duration, price, schedule },
    { name, duration, price, schedule }
  ],
  reviews: [
    { studentName, rating, text, date },
    { studentName, rating, text, date }
  ]
}
```

**Pros:**

- ✅ Single query for everything
- ✅ Fast reads
- ✅ Natural for MongoDB

**Cons:**

- ❌ Data duplication
- ❌ Hard to update (update everywhere)
- ❌ Document size limits (16MB)

---

#### Approach C: Hybrid (Recommended)

**Strategy:**

```javascript
// Separate collections for entities that:
// - Are frequently accessed independently
// - Have many-to-many relationships
// - Grow unbounded (reviews, bookings)

Users { _id, name, email, phone, location }

Instructors {
  _id,
  userId: ObjectId, // Reference
  name, // Denormalize frequently accessed
  email,
  bio,
  specializations: [],

  // Embed small, contained data
  studio: {
    name,
    address,
    location: { type: "Point", coordinates: [lng, lat] },
    facilities: []
  },

  // Aggregate stats (update periodically)
  stats: {
    totalClasses: 156,
    totalStudents: 892,
    rating: { average: 4.8, count: 120 }
  }
}

Classes {
  _id,
  instructorId: ObjectId, // Reference
  instructorName, // Denormalize for listing
  name,
  type,
  price,
  schedule: { days: [], time: {} }
}

Bookings {
  _id,
  studentId: ObjectId,
  instructorId: ObjectId,
  classId: ObjectId,

  // Denormalize for quick access
  studentName,
  instructorName,
  className,

  date,
  status,
  payment: {}
}

Reviews {
  _id,
  bookingId: ObjectId,
  studentId: ObjectId,
  instructorId: ObjectId,

  // Denormalize
  studentName,

  rating: { overall: 5, categories: {} },
  text,
  createdAt
}
```

**Rules of Thumb:**

1. **Embed** if:
   - Data is small and fixed size
   - Data is always accessed together
   - One-to-few relationship

2. **Reference** if:
   - Data is large or unbounded
   - Data is accessed independently
   - Many-to-many relationship

3. **Denormalize** frequently accessed fields for performance

---

### Indexes Strategy

**Critical Indexes:**

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 }, { unique: true });

// Instructors
db.instructors.createIndex({ userId: 1 });
db.instructors.createIndex({ 'studio.location': '2dsphere' }); // Geo queries
db.instructors.createIndex({ specializations: 1 });
db.instructors.createIndex({ 'stats.rating.average': -1 });
db.instructors.createIndex({ status: 1 });

// Classes
db.classes.createIndex({ instructorId: 1 });
db.classes.createIndex({ type: 1, status: 1 });
db.classes.createIndex({ price: 1 });

// Bookings
db.bookings.createIndex({ studentId: 1, status: 1 });
db.bookings.createIndex({ instructorId: 1, date: -1 });
db.bookings.createIndex({ classId: 1, date: 1 });
db.bookings.createIndex({ status: 1, date: 1 });
db.bookings.createIndex(
  { razorpay_order_id: 1 },
  { unique: true, sparse: true },
);

// Reviews
db.reviews.createIndex({ instructorId: 1, createdAt: -1 });
db.reviews.createIndex({ bookingId: 1 }, { unique: true });
db.reviews.createIndex({ studentId: 1 });
```

**Why These Indexes?**

- Location index enables fast geo queries
- Status indexes for filtering active/cancelled
- Date indexes for time-based queries
- Foreign keys for JOINs ($lookup)

---

**💡 My Database Design Recommendation:**

```javascript
const schemaDesign = {
  philosophy: 'Hybrid (normalize entities, denormalize reads)',

  mainCollections: [
    'users',
    'instructors',
    'classes',
    'bookings',
    'reviews',
    'messages',
    'notifications',
  ],

  denormalization: {
    where: 'Frequently accessed fields in lists',
    example: 'Store instructorName in bookings for quick display',
    update_strategy: 'Background job updates denormalized data',
  },

  indexes: 'Create based on query patterns (above list)',

  aggregations: 'Use for complex reports, cache results',

  backups: 'Daily automated backups to S3',
};
```

---

## 13. Scaling Strategy

### Question: How to handle growth?

#### Current Setup (MVP - Day 1)

```
Single server:
├── Node.js application
├── MongoDB database
├── Nginx (web server)
└── PM2 (process manager)

Handles: ~1000 users, 100 concurrent requests
Cost: ₹2,000-5,000/month (DigitalOcean/AWS EC2)
```

---

#### Stage 2: Growing (1000-10000 users)

```
Load Balancer
├── App Server 1
├── App Server 2
└── App Server 3

Separate Database Server:
└── MongoDB (upgraded instance)

Cache Layer:
└── Redis (sessions, frequently accessed data)

File Storage:
└── AWS S3 / Cloudinary

CDN:
└── CloudFlare (static assets)

Cost: ₹15,000-30,000/month
```

**What Changed:**

- Multiple app servers (horizontal scaling)
- Database on separate, larger instance
- Redis for caching (reduce DB load)
- CDN for faster asset delivery

---

#### Stage 3: Scale (10,000+ users)

```
Load Balancer (AWS ELB/ALB)
├── Auto-scaling Group (3-10 app servers)

Database:
├── MongoDB Atlas (Managed, auto-scaling)
└── Read Replicas (for analytics, reports)

Caching:
├── Redis Cluster (sessions, API responses)
└── CloudFront (CDN for all static content)

Queue System:
└── Bull/RabbitMQ (background jobs)

Monitoring:
├── New Relic / DataDog (performance)
├── Sentry (error tracking)
└── CloudWatch (logs, alerts)

Cost: ₹50,000-1,00,000/month
```

---

### Performance Optimization Strategies

#### 1. Database Query Optimization

```javascript
// ❌ Bad: N+1 query problem
const bookings = await Booking.find({ studentId: userId });
for (let booking of bookings) {
  booking.instructor = await Instructor.findById(booking.instructorId);
}

// ✅ Good: Single aggregation
const bookings = await Booking.aggregate([
  { $match: { studentId: userId } },
  {
    $lookup: {
      from: 'instructors',
      localField: 'instructorId',
      foreignField: '_id',
      as: 'instructor',
    },
  },
  { $unwind: '$instructor' },
]);
```

---

#### 2. Caching Strategy

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// Cache instructor profiles (change infrequently)
const getInstructor = async (id) => {
  // Try cache first
  const cached = await redis.get(`instructor:${id}`);
  if (cached) return JSON.parse(cached);

  // If not in cache, fetch from DB
  const instructor = await Instructor.findById(id);

  // Store in cache (expire in 1 hour)
  await redis.setex(`instructor:${id}`, 3600, JSON.stringify(instructor));

  return instructor;
};

// Invalidate cache on update
const updateInstructor = async (id, data) => {
  await Instructor.findByIdAndUpdate(id, data);
  await redis.del(`instructor:${id}`); // Clear cache
};
```

---

#### 3. API Response Time Targets

```
Search API: < 200ms
Profile fetch: < 100ms
Booking creation: < 500ms
Payment processing: < 2s
Image upload: < 3s
```

**How to Achieve:**

- Database indexes
- Redis caching
- Optimized queries
- Async operations where possible

---

**💡 Scaling Recommendation:**

**Don't over-engineer Day 1!**

```javascript
const scalingPlan = {
  mvp: {
    setup: 'Single DigitalOcean droplet (₹3,000/month)',
    handles: '1000 users comfortably',
    when_to_upgrade: 'CPU > 70% consistently OR Response time > 1s',
  },

  stage2: {
    trigger: '5000+ users OR slow performance',
    upgrades: [
      'Add Redis for caching',
      'Separate database server',
      'Add second app server + load balancer',
    ],
    cost: '₹15,000-20,000/month',
  },

  stage3: {
    trigger: '50,000+ users',
    upgrades: [
      'Auto-scaling app servers',
      'MongoDB Atlas (managed)',
      'Microservices architecture',
      'Full monitoring suite',
    ],
  },

  philosophy: 'Scale when needed, not before',
};
```

---

## 14. Admin Control Level

### Question: How much power should admin have?

#### Option A: Full Control (God Mode)

**Admin can:**

- Edit any user/instructor data
- Delete bookings
- Override any system rule
- Refund manually
- Change ratings
- See all conversations

**Pros:**

- ✅ Can fix any problem
- ✅ Maximum flexibility
- ✅ Handle edge cases

**Cons:**

- ❌ Potential for abuse
- ❌ Trust issues
- ❌ Privacy concerns

---

#### Option B: Limited Control (Recommended)

**Admin can:**

- ✅ Approve/reject instructor applications
- ✅ Suspend users (with reason)
- ✅ View reports and analytics
- ✅ Moderate flagged reviews
- ✅ Process refunds (within policy)
- ✅ Handle disputes

**Admin cannot:**

- ❌ Edit instructor profiles (except verification status)
- ❌ Change ratings
- ❌ Read private messages (unless reported)
- ❌ Delete successful bookings
- ❌ Override payment amounts

**Pros:**

- ✅ Maintains trust
- ✅ Protects privacy
- ✅ Audit trail
