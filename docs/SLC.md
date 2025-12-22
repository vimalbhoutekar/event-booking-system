# SERVICE LEVEL AGREEMENT

## EventsPro - Third-Party Event Organizer Platform

---

**PLATFORM DECLARATION**

EventsPro operates as an **open marketplace platform** connecting independent third-party event organizers with ticket buyers.

**CRITICAL CLARIFICATION:**

- EventsPro does **NOT produce, own, or organize events**
- All events are created and managed by **independent third-party organizers**
- Platform acts solely as **intermediary and technology service provider**
- Organizers are **independent contractors**, not employees or agents of EventsPro

This Service Level Agreement governs the relationship between EventsPro (Platform), Third-Party Organizers, and End Customers.

---

**Document Details:**

- **Effective Date:** December 5, 2024
- **Document Version:** 1.0 (Production)
- **Platform Name:** EventsPro
- **Business Model:** Third-Party Marketplace (Non-Producer)
- **Jurisdiction:** Bhopal, Madhya Pradesh, India

---

## 1. PARTIES & PLATFORM MODEL

### 1.1 Parties to This Agreement

**Platform: EventsPro**

- Technology service provider
- Payment processing facilitator
- Marketplace operator
- Does NOT own, produce, or organize events

**Third-Party Organizers:**

- Independent event creators and producers
- Responsible for event planning, execution, and delivery
- Register on platform to list their events
- Manage event content, pricing, and policies

**End Customers (Ticket Buyers):**

- Users who purchase tickets through platform
- Book tickets for events created by third-party organizers
- Platform facilitates transaction but does not guarantee event quality

### 1.2 Third-Party Platform Model (CRITICAL SECTION)

**EventsPro Platform Architecture:**

**Open Marketplace:**

- Any verified user can register as event organizer
- Organizers list events independently without platform pre-approval (post-verification)
- Platform provides technology infrastructure, not event content

**Clear Separation of Responsibilities:**

```
EventsPro (Platform):
├─ Provides ticketing technology
├─ Processes payments securely
├─ Generates digital tickets
├─ Facilitates settlements to organizers
└─ Customer support for platform issues

Third-Party Organizers:
├─ Create and produce events
├─ Set ticket prices and policies
├─ Execute events at specified venues
├─ Manage event quality and experience
└─ Handle event-specific customer queries
```

**Platform Does NOT:**

- ❌ Organize, produce, or control event content
- ❌ Guarantee event quality, performance, or execution
- ❌ Act as agent or representative of organizers
- ❌ Assume liability for event failures or cancellations
- ❌ Participate in event revenue sharing (commission-based only)

**Analogy:** EventsPro operates like YouTube (platform for creators) or Uber (platform for drivers), NOT like a production house that creates content.

### 1.3 Third-Party Organizer Onboarding

**How Third-Party Organizers Join Platform:**

**Registration Process:**

1. Organizer creates account with valid ID (PAN, Aadhaar)
2. Provides business details (if applicable)
3. Agrees to platform terms and commission structure
4. Verifies bank account for settlements

**Verification (First Event):**

- Identity verification (government ID)
- Business registration (if organized entity)
- Venue booking confirmation
- First event manually reviewed (1-2 business days)

**Post-Verification:**

- Organizer receives "Verified" badge
- Can list unlimited events independently
- Auto-approval for subsequent events

**Organizer Independence:**

- Full control over event details, pricing, cancellation policies
- Platform cannot dictate event content or terms
- Organizer-customer relationship is primary; platform facilitates transaction

---

## 2. COMMISSION & PRICING STRUCTURE

### 2.1 Commission Model (Platform Revenue)

**EventsPro charges 10% commission on ticket base price**

This is platform's **sole revenue source** - we do NOT:

- Share in event profits
- Participate in event sponsorships
- Receive venue kickbacks
- Charge organizers listing fees

**Transparent Pricing Formula:**

```
Organizer Sets: Base Price (e.g., ₹1,000)
Platform Adds: 10% Commission (₹100)
Customer Pays: Total (₹1,100)

Revenue Split:
- Organizer receives: ₹1,000 (100% of base price)
- Platform receives: ₹100 (commission for technology services)
```

### 2.2 Commission Justification

**What Platform Provides for 10% Commission:**

- Secure payment gateway integration (PCI-DSS compliant)
- Digital ticket generation with QR codes
- Customer support infrastructure
- Fraud detection and prevention
- Settlement processing and bank transfers
- Platform maintenance and uptime (99.5% SLA)
- Marketing and discovery features

### 2.3 Payment Gateway Charges

**Platform Absorbs Gateway Costs:**

- Razorpay/payment gateway fees: 2-3% of transaction
- Deducted from platform's 10% commission
- Organizer receives full base price without deductions

**Example:**

```
Transaction: ₹1,100 (₹1,000 base + ₹100 commission)
Gateway fee (2%): ₹22
Platform net revenue: ₹100 - ₹22 = ₹78
Organizer receives: ₹1,000 (unaffected by gateway charges)
```

### 2.4 No Hidden Charges

**Platform Guarantees:**

- No surprise deductions from organizer settlements
- No listing fees or subscription charges
- No percentage cuts from sponsorships or merchandise
- Commission rate locked (changes require 30-day notice)

---

## 3. SETTLEMENT TO THIRD-PARTY ORGANIZERS

### 3.1 Settlement Timeline

**Standard: 7 business days after event completion**

**Rationale for 7-Day Hold:**
Since organizers are **third-party entities** not controlled by platform:

- Allows customer refund window (if event not conducted)
- Provides dispute resolution period
- Verifies event actually took place
- Protects customers from fraudulent organizers
- Industry-standard escrow period

**Settlement Example:**

```
Event by Organizer "ABC Events":
Event Date: December 15, 2024
Event Ends: 11:59 PM
Settlement Eligible: December 16, 2024
Payment to Organizer's Bank: December 23, 2024
```

### 3.2 Settlement Calculation (Transparent)

**Platform Provides Detailed Breakdown:**

```
Example: Tech Conference by "XYZ Organizers"

Total Bookings: 100 tickets × ₹1,000 = ₹1,00,000
Customer Cancellations: 10 tickets = ₹10,000 refunded
Net Confirmed Bookings: 90 tickets = ₹90,000

Settlement to Organizer:
Gross Revenue: ₹90,000
Platform Commission (10%): ₹9,000
Net Payable: ₹81,000

Platform sends ₹81,000 to organizer's registered bank account
```

**Booking-Level Transparency:**

- Each settlement linked to individual bookings (junction table)
- Organizer can download detailed report
- Booking IDs, customer names (masked), amounts visible
- Audit trail for tax and compliance

### 3.3 Bank Account Requirements

**Third-Party Organizer Bank Details:**

- Account holder name must match organizer profile
- Individual organizer: Personal bank account
- Business organizer: Business account with matching registration
- PAN card mandatory for tax compliance
- Account verification via penny-drop test before first settlement

**Why Strict Verification:**
Since organizers are independent third parties, platform must ensure:

- Funds reach legitimate organizer
- Anti-money laundering compliance
- Tax transparency (TDS may apply in future)

### 3.4 Settlement Holds & Disputes

**Platform May Withhold Settlement If:**

- Multiple customer complaints about event quality/cancellation
- Suspected fraudulent activity
- Organizer unresponsive to customer issues
- Legal disputes or court orders

**Hold Period:** Up to 30 days during investigation  
**Resolution:** Funds released upon dispute resolution or split per arbitration

---

## 4. GST & TAXATION

### 4.1 Current GST Status (December 2024)

**Platform GST Registration: NOT REQUIRED**

- EventsPro annual commission below ₹20 Lakh threshold
- No GST charged on platform fee currently
- Organizers invoice customers directly (no GST from platform)

**Customer Invoice (Current):**

```
Ticket Base Price: ₹1,000 (organizer's service)
Platform Fee: ₹100 (platform's service)
Total: ₹1,100
GST: Not applicable
```

### 4.2 Future GST Implementation (₹20L+ Commission)

**When Platform Crosses ₹20 Lakh Annual Commission:**

Platform will register for GST and charge:

- **GST @18% on platform fee ONLY** (not on ticket base price)
- Ticket base price remains organizer's domain (organizer's GST responsibility)

**Post-GST Customer Invoice:**

```
Ticket Base Price: ₹1,000 (organizer's revenue)
Platform Fee: ₹100
GST @18% on Platform Fee: ₹18
Total Customer Pays: ₹1,118

Revenue Distribution:
- Organizer: ₹1,000 (unchanged)
- Platform: ₹100 (before remitting ₹18 GST to govt)
- Government: ₹18 (platform remits monthly)
```

**IGST vs CGST+SGST:**

- Interstate: IGST @18%
- Intrastate (same state): CGST 9% + SGST 9%
- Amount same, split differs based on customer location

### 4.3 Third-Party Organizer GST Obligations

**CRITICAL SEPARATION:**

- Organizer's GST obligations are **independent** from platform's GST
- If organizer's annual turnover > ₹20 Lakh, organizer must register for GST separately
- Organizer responsible for GST on ticket base price (if applicable)
- Platform does NOT collect or remit GST on behalf of organizers

**Platform's Role:**

- Provides settlement reports for organizer's tax filing
- Issues GST invoice for platform fee (when registered)
- Not responsible for organizer's tax compliance

**Example: Both Registered for GST (Future):**

```
Organizer (Annual turnover ₹30L - GST registered)
Platform (Annual commission ₹25L - GST registered)

Customer Invoice:
Ticket Base Price: ₹1,000
GST @18% (on ticket): ₹180 [Organizer collects & remits]
Platform Fee: ₹100
GST @18% (on fee): ₹18 [Platform collects & remits]
Total: ₹1,298

Note: Separate GST by organizer and platform
```

---

## 5. REFUND & CANCELLATION POLICY

### 5.1 Third-Party Organizer Cancels Event

**Since Organizer is Independent Third Party:**

**If Organizer Cancels:**

- **100% customer refund mandatory** (base + platform fee)
- Platform waives commission (earns ₹0)
- Organizer must provide 48-hour advance notice
- Late cancellation (< 48 hours): Platform may charge organizer 5% administrative fee

**Refund Timeline:** 5-7 business days to customer's original payment method

**Platform Protection:**

- Refunds issued from organizer's future settlements
- If organizer has no pending settlements, platform absorbs refund cost temporarily
- Platform may pursue legal recovery from organizer

**Example:**

```
Event: "Rock Concert" by organizer "Live Music Co."
Bookings: 500 tickets × ₹800 = ₹4,00,000
Platform fee collected: ₹40,000
Total: ₹4,40,000

Organizer cancels (48h notice):
Refund to customers: ₹4,40,000 (full amount)
Platform loss: ₹40,000 (commission waived)
Organizer loss: ₹4,00,000 + any venue/vendor costs

If future settlements available:
Platform deducts ₹4,00,000 from organizer's next events
If not available:
Platform may ban organizer and pursue legal action
```

### 5.2 Customer Cancels Booking

**Cancellation Policy Set by Third-Party Organizer:**

Platform provides tools; organizer decides:

1. **Cancellation Allowed:** Yes/No
2. **Cancellation Deadline:** Hours before event (e.g., 24h, 48h, 72h)
3. **Cancellation Fee:** Percentage (0-20% of base price)

**Platform Role:**

- Enforces organizer's policy automatically
- Cannot override organizer's rules
- Processes refunds per policy

**Example Scenario:**

```
Organizer Policy: 48h deadline, 10% cancellation fee

Customer books: ₹1,100 (₹1,000 base + ₹100 platform fee)
Customer cancels: 3 days before event (within policy)

Refund Calculation:
Base: ₹1,000
Cancellation Fee (10%): ₹100 (organizer retains)
Refundable Base: ₹900
Platform Fee: ₹100 (fully refunded)
Total Refund: ₹1,000

Result:
- Customer receives: ₹1,000
- Organizer keeps: ₹100 (cancellation fee)
- Platform: ₹0 (commission waived on cancelled booking)
```

### 5.3 Force Majeure (Acts of God)

**Events Cancelled Due to Unforeseeable Circumstances:**

- Natural disasters, pandemics, government lockdowns
- Neither platform nor organizer at fault

**Refund Policy:**

- 100% refund to customers (base + platform fee)
- No cancellation fee to customers
- Platform waives commission

**Loss Sharing (50-50):**

```
Government lockdown cancels event:
Customer refunds: ₹10,00,000 total
Loss split:
- Organizer absorbs: ₹5,00,000
- Platform absorbs: ₹5,00,000

Rationale: Neither party at fault, fair loss distribution
```

---

## 6. THIRD-PARTY ORGANIZER RESPONSIBILITIES

### 6.1 Event Creation & Information

**Since Organizers are Independent Third Parties:**

**Organizer Must Provide:**

- Accurate event details (date, time, venue, description)
- Truthful promotional materials (no false claims)
- Realistic seat capacity based on venue
- Clear pricing without hidden charges
- Transparent cancellation policy
- Age restrictions or content warnings (if applicable)

**Platform Cannot:**

- Verify every claim made by organizer (celebrity appearances, etc.)
- Guarantee event quality or accuracy of description
- Control organizer's event planning decisions

**Platform's Role:**

- Provide event creation tools
- Flag suspicious events (fraud detection)
- Remove events violating laws or platform policies
- Display organizer-provided information as-is

### 6.2 Event Execution Standards

**Organizer Fully Responsible For:**

- Conducting event as advertised
- Venue booking and arrangements
- Talent/speaker confirmations
- Safety and security at venue
- Honoring all tickets sold
- Entry management (QR code scanning)
- Customer experience at event

**Platform's Limited Role:**

- Provides QR code scanning app for entry verification
- Tracks scanned tickets (prevents duplicate entry)
- NOT responsible for event failures, poor quality, or mismanagement

**Customer Complaints:**

- Event-related complaints: Organizer's responsibility
- Platform-related complaints (payment, ticket delivery): Platform's responsibility

### 6.3 Legal Compliance

**Third-Party Organizer Must:**

- Obtain all permits and licenses (venue, police NOC, music, food)
- Comply with local laws and regulations
- Event insurance (recommended; mandatory for 1000+ attendees)
- Age verification for 18+ events (alcohol, mature content)
- Copyright compliance (music, videos, celebrity images)

**Platform's Legal Standing:**

- Platform is intermediary under IT Act, 2000
- Not liable for organizer's legal violations
- Cooperates with law enforcement if organizer commits fraud/crime
- May suspend/ban organizer for illegal activities

### 6.4 Bank Account & Financial Transparency

**Organizer Must Provide:**

- Valid bank account in organizer's name (or business entity)
- PAN card for tax purposes
- GST number (if registered)
- Accurate IFSC code and account number

**Verification Required:**

- First-time organizers: Penny-drop verification
- Business organizers: Match company registration
- Changes require re-verification (1-2 business days)

**Why Strict Verification:**

- Prevents money laundering
- Ensures funds reach legitimate organizer
- Tax compliance (TDS may apply in future)
- Protects platform from regulatory issues

---

## 7. PLATFORM RESPONSIBILITIES & LIMITATIONS

### 7.1 What Platform Provides

**Technology Services:**

- Event listing and discovery platform
- Secure payment processing (PCI-DSS compliant)
- Digital ticket generation with QR codes
- Settlement processing to organizers
- Customer support for platform-related issues
- Fraud detection and prevention systems

**Service Level Commitments:**

- 99.5% platform uptime (monthly)
- 24-hour customer support response time
- 7-day settlement timeline adherence
- Secure data storage (7-year retention)

### 7.2 What Platform Does NOT Guarantee

**Platform as Intermediary - Not Event Producer:**

**Platform is NOT Responsible For:**

- ❌ Event quality, execution, or performance
- ❌ Organizer's fulfillment of promises (celebrity appearances, venue quality)
- ❌ Event cancellations or postponements by organizer
- ❌ Customer dissatisfaction with event experience
- ❌ Injuries, accidents, or property damage at venues
- ❌ Organizer's financial stability or ability to conduct event
- ❌ Venue problems (poor facilities, inadequate seating)
- ❌ Artist/speaker no-shows or poor performances

**Platform Role:**

- Facilitate transaction between organizer and customer
- Provide technology tools for ticketing
- Hold organizer accountable per this SLA
- Assist in dispute resolution (but not guarantee outcomes)

### 7.3 Customer Support Scope

**Platform Handles:**

- Payment failures or transaction issues
- Ticket delivery problems (email not received)
- Account login and access issues
- Refund processing (per organizer's policy)
- QR code technical issues
- Platform bugs or downtime

**Organizer Handles:**

- Event-specific queries (parking, dress code, timings)
- Event content questions (who's performing, agenda)
- Venue directions beyond address
- Accommodation or travel arrangements
- Backstage passes or VIP requests

**Contact Channels:**

- Platform support: support@eventspro.com
- Organizer contact: Provided on event page

---

## 8. LIABILITY & INDEMNIFICATION

### 8.1 Platform Liability Limitations

**Maximum Platform Liability:**
Limited to **platform commission earned** from the specific disputed transaction.

**Example:**

```
Transaction: ₹1,100 (₹1,000 base + ₹100 commission)
Platform commission: ₹100
Maximum platform liability: ₹100

If event fails and customer seeks compensation:
Platform's maximum exposure: ₹100 (refund of platform fee)
Organizer's liability: ₹1,000 + any consequential damages
```

**Platform NOT Liable For:**

- Organizer's event failures or cancellations
- Customer's indirect losses (travel, accommodation costs)
- Organizer's insolvency or inability to conduct event
- Force majeure events (natural disasters, government actions)
- Third-party service failures (venue issues, talent no-shows)

**Legal Basis:**
Platform acts as **intermediary** under IT Act, 2000 Section 79:

- Not liable for third-party content or services
- Liability limited once hosting/listing removed upon notice

### 8.2 Third-Party Organizer Indemnification

**Organizer Agrees to Indemnify Platform Against:**

**Claims Arising From:**

- Event execution failures or poor quality
- False advertising or misleading event descriptions
- Copyright/IP violations (using celebrity images without permission)
- Customer injuries or property damage at event venue
- Violations of local laws or regulations
- Breach of promises made in event listing
- Failure to obtain necessary permits/licenses

**Indemnification Process:**
If platform faces legal action due to organizer's conduct:

1. Platform notifies organizer immediately
2. Organizer assumes legal defense or reimburses platform's costs
3. Platform may withhold settlements to cover legal expenses
4. Organizer liable for damages, fines, or judgments

**Example Scenario:**

```
Organizer uses Bollywood actor's image without permission in event poster
Actor sues platform for copyright infringement (₹10 Lakh claim)

Organizer's Indemnification Obligation:
- Defend lawsuit or hire lawyer
- Reimburse platform's legal fees
- Pay any damages awarded
- Platform withholds organizer's settlements until resolved
```

### 8.3 Platform Indemnification to Organizer

**Platform Indemnifies Organizer Against:**

- Payment processing errors (platform's technical fault)
- Data breaches in platform infrastructure
- Incorrect settlement calculations (platform's bug)
- Platform software defects causing financial loss

**Platform Liability Cap:** ₹10 Lakh annually across all organizers

**Does NOT Cover:**

- Organizer's own errors or mismanagement
- Event-related losses or poor ticket sales
- Customer refunds due to organizer's cancellation

---

## 9. DISPUTE RESOLUTION

### 9.1 Types of Disputes

**Customer vs Organizer:**

- Event quality, cancellation, refund disputes
- Platform facilitates resolution but does not guarantee outcome
- Organizer's responsibility to address customer complaints

**Customer vs Platform:**

- Payment issues, ticket delivery, platform bugs
- Platform resolves within 7 business days

**Organizer vs Platform:**

- Settlement calculation errors
- Account suspension/termination
- Policy violations

### 9.2 Dispute Reporting & Timeline

**Reporting Requirements:**

- Customer disputes: Within 48 hours of issue
- Organizer settlement disputes: Within 7 days of settlement
- Submit via platform's dispute form with evidence

**Resolution Process:**

1. **Acknowledgment:** 24 hours
2. **Investigation:** 2-3 days (evidence collection)
3. **Decision:** Within 7 business days
4. **Implementation:** 2-3 days (refunds, adjustments)

**Escalation Path:**

- Level 1: Support team
- Level 2: Dispute manager
- Level 3: Senior management
- Final: Arbitration or legal action

### 9.3 Platform's Decision Authority

**Platform Has Final Say On:**

- Policy violations (fake events, fraud)
- Account termination decisions
- Technical disputes (payment processing errors)

**Platform Cannot Force:**

- Organizer to conduct event differently
- Customer to accept substandard event
- Refunds for subjective complaints ("event was boring")

**Ambiguous Cases:**

- Benefit of doubt to customer (consumer protection)
- Platform may mediate but not impose settlement

---

## 10. ACCOUNT TERMINATION

### 10.1 Third-Party Organizer Voluntary Exit

**Termination by Organizer:**

- 30 days written notice
- Complete or cancel all active events
- Pending settlements processed per standard timeline
- Customer commitments must be honored

**Data Retention:**

- Organizer data retained for 7 years (tax/legal compliance)
- Soft-delete: Recoverable for 90 days
- Re-registration allowed after 6 months

### 10.2 Platform Terminates Organizer

**Grounds for Immediate Ban:**

- Fraudulent events or fake listings
- Repeated event cancellations (3+ in 6 months)
- Consistent negative customer feedback (< 2.0 rating, 10+ reviews)
- Legal violations (copyright infringement, safety violations)
- Money laundering attempts
- Impersonation or identity theft

**Suspension Process (Minor Violations):**

1. Warning issued with corrective actions required
2. Temporary suspension (7-15 days to comply)
3. Account restored upon resolution
4. Permanent ban if issues persist

**Financial Settlement Upon Ban:**

- Legitimate pending settlements processed
- Refund reserves withheld (90 days for customer protection)
- Platform may deduct outstanding refunds owed to customers
- No payouts for fraudulent organizers

**Appeal Rights:**

- Organizer can appeal within 15 days
- Independent review by senior management
- Decision communicated within 30 days
- No multiple appeals

---

## 11. INTELLECTUAL PROPERTY RIGHTS

### 11.1 Platform IP

**EventsPro Owns:**

- Platform name, logo, trademarks
- Website design, software code, algorithms
- Proprietary technology and databases

**Organizer May Use:**

- "Book on EventsPro" badge with link to event page
- Platform name in promotional materials (factually)
- Cannot misrepresent affiliation or endorsement

### 11.2 Third-Party Organizer Content

**Organizer Retains Ownership:**

- Event descriptions, promotional text
- Event branding, logos, images
- Intellectual property related to event

**License to Platform:**
By uploading content, organizer grants platform **non-exclusive, royalty-free license** to:

- Display content on platform (website, mobile app)
- Use in marketing to promote platform
- Share on social media to drive event discovery

**License Duration:**

- Active during event listing
- 90 days post-event (reviews, historical records)
- Terminates upon account deletion

### 11.3 Copyright Compliance (CRITICAL)

**Organizer Certifications:**
All uploaded content:

- Is original work OR properly licensed
- Does not infringe third-party copyrights, trademarks, or IP
- Has permissions for celebrity images, brand logos, music

**Prohibited Content:**

- Copyrighted images without permission (movie posters, celebrity photos)
- Pirated music or video
- Trademarked logos without authorization
- Plagiarized event descriptions

**DMCA-Style Takedown:**

1. Copyright owner files complaint: dmca@eventspro.com
2. Platform removes content within 24 hours
3. Organizer notified with reason
4. Counter-notice option if content legitimate
5. Three-strike policy: Third violation = permanent ban

**Organizer Liability:**

- Platform not liable for organizer's IP violations
- Organizer indemnifies platform (see Section 8.2)
- Legal action pursued against infringing organizer

---

## 12. FORCE MAJEURE

### 12.1 Definition & Scope

**Force Majeure Events:**

- Natural disasters (earthquakes, floods, cyclones)
- Pandemics and health emergencies (COVID-19 precedent)
- Government actions (lockdowns, curfews, event bans)
- Civil unrest, war, terrorism
- Infrastructure failures (widespread power/internet outages)

**COVID-19 Learning:**
Platform policies evolved post-pandemic to handle large-scale cancellations fairly.

### 12.2 Effect on Third-Party Organizers

**If Force Majeure Prevents Event:**

- Organizer can cancel without 48-hour notice penalty
- 100% customer refund mandatory (base + platform fee)
- Platform waives commission
- No organizer liability for cancellation

**Loss Sharing:**
For **government-mandated lockdowns** or similar unforeseeable public emergencies:

- Platform and organizer share refund burden 50-50
- Protects both parties from catastrophic losses

**Example:**

```
Lockdown cancels "Music Festival"
Customer refunds required: ₹50,00,000

Loss Split:
- Organizer absorbs: ₹25,00,000
- Platform absorbs: ₹25,00,000

Without loss sharing:
- Organizer would lose ₹50L (bankruptcy risk)
- Platform waives commission but shares refund burden for fairness
```

### 12.3 Notice Requirements

**Organizer Must:**

- Notify platform within 24 hours of force majeure event
- Provide evidence (government notification, news reports)
- Cooperate with customer refund process
- Attempt to reschedule if possible (customer consent required)

**Platform Will:**

- Expedite refunds (7-10 business days vs standard timeline)
- Waive processing fees
- Assist with customer communication

### 12.4 Event Rescheduling

**Option Available:**

- Organizer announces new date/time
- Customers choose: Attend rescheduled event OR get full refund
- Tickets remain valid (no rebooking needed)
- Flexible for customers unable to attend new date

---

## 13. EVENT VERIFICATION & FRAUD PREVENTION

### 13.1 Third-Party Organizer Verification

**Why Verification Critical:**
Since organizers are **independent third parties**, platform must protect customers from fraudulent actors.

**First-Time Organizer Requirements:**

1. **Identity Verification:** Government ID (Aadhaar/PAN)
2. **Contact Verification:** Email and phone OTP
3. **Business Verification:** Registration documents (if applicable)
4. **Venue Confirmation:** Booking proof or venue agreement
5. **First Event Review:** Manual approval (1-2 business days)

**Red Flags Detected:**

- Newly created accounts listing high-value events
- Unrealistic promises (celebrity appearances without proof)
- Suspicious pricing (₹10 for "concert" tickets)
- Venue address mismatch or non-existent location
- No online presence (organizer has no website/social media)

**Automated Fraud Detection:**

- Machine learning models flag suspicious patterns
- Velocity checks (same organizer creating 10+ events in 1 hour)
- Duplicate event detection across accounts
- Payment pattern analysis

### 13.2 Customer Protection Mechanisms

**Escrow Model (7-Day Hold):**

- Organizer's payment held until event completion
- Allows customer complaint window
- Platform can issue refunds from escrow if event not conducted

**Refund Guarantee:**
If third-party organizer commits fraud:

- Platform guarantees customer refund (even if organizer disappears)
- Platform absorbs loss temporarily
- Pursues legal recovery from organizer
- Customer never loses money to confirmed fraud

**Reporting:**

- "Report Event" button on every listing
- Fraud hotline: fraud@eventspro.com
- Anonymous reporting supported

### 13.3 Verified Organizer Badge

**Auto-Approval After:**

- 5+ successfully completed events
- Zero fraud complaints or disputes
- Positive customer ratings (> 4.0/5.0)
- Consistent event execution

**Benefits:**

- Instant event publishing (no manual review)
- Higher search ranking (trustworthy)
- Customer confidence boost

---

## 14. AGE RESTRICTIONS & CONTENT RATING

### 14.1 Third-Party Organizer's Content Disclosure

**Organizer Must Disclose:**

- Age restrictions (18+, 13+, All Ages)
- Content warnings (violence, sexual content, strong language)
- Special warnings (flashing lights, loud noises)

**Platform Provides Tools:**

- Age restriction toggle during event creation
- Content warning checkboxes
- Prominent display on event page

**Platform NOT Responsible:**

- Physical age verification at venue (organizer's duty)
- Content accuracy (organizer self-certifies)
- Organizer's failure to enforce restrictions

### 14.2 Age Categories

**18+ Events (Strict Verification):**

- Alcohol-focused events, adult comedy shows, mature content
- Organizer MUST verify government ID at entry
- Platform sends confirmation warnings during booking
- Organizer liable if minor gains entry

**13+ Events:**

- Teen concerts, young adult content
- Parental guidance recommended

**All Ages:**

- Family-friendly, G-rated content

### 14.3 Liability for Age Violations

**If Minor Gains Entry to 18+ Event:**

- Organizer fully liable (failed verification)
- Platform not liable (provided tools and warnings)
- Customer's parents may sue organizer, not platform
- Platform cooperates with investigations

---

## 15. MODIFICATIONS TO AGREEMENT

### 15.1 Amendment Process

**Platform's Right to Modify:**

- Major changes: 30 days advance notice (email + dashboard)
- Minor updates: 7 days notice
- Emergency changes: Immediate (legal compliance, security)

**Continued Use = Acceptance:**

- Organizers who continue using platform after notice period = acceptance
- Opt-out right: Terminate account during notice period without penalty
- Pending settlements honored under old terms

### 15.2 Version Control

**Transparency:**

- All SLA versions archived publicly
- Version number and effective date displayed
- Change log published
- Disputes resolved per version active at transaction time

---

## 16. GOVERNING LAW & JURISDICTION

### 16.1 Applicable Law

**This Agreement Governed By:**

- Laws of India (Republic of India)
- Indian Contract Act, 1872
- Information Technology Act, 2000 (Intermediary Guidelines)
- Consumer Protection Act, 2019
- Goods and Services Tax Act, 2017 (when applicable)

**Language:** English (prevails in case of translation disputes)

### 16.2 Jurisdiction

**Exclusive Jurisdiction:**
Courts in **Bhopal, Madhya Pradesh, India**

**Why Bhopal:**

- Platform's registered office location
- Centralized dispute resolution
- Consistent legal interpretations
- Organizers and customers consent to jurisdiction

### 16.3 Arbitration (Preferred Resolution)

**Before Court Litigation:**
Parties agree to attempt **arbitration** per Arbitration and Conciliation Act, 1996

**Arbitration Process:**

1. Disputing party sends notice (30 days to respond)
2. Single arbitrator mutually agreed; if not, platform appoints neutral arbitrator
3. Venue: Bhopal (virtual hearings permitted)
4. Language: English
5. Award within 6 months
6. Costs shared equally unless arbitrator decides otherwise
7. Decision binding (limited appeal grounds)

**Exceptions:**

- Urgent injunctive relief (direct court access)
- Criminal matters (law enforcement involvement)
- Fraud cases (immediate legal action)

### 16.4 Limitation Period

**Statute of Limitations:**

- Claims filed within **2 years** from dispute arising
- Fraud claims: 3 years from discovery
- After limitation period: Claims barred

---

## 17. AUDIT & COMPLIANCE

### 17.1 Financial Transparency

**Platform Maintains:**

- Detailed transaction ledgers (7-year retention)
- Junction table linking bookings to settlements
- Audit trail for every rupee transferred

**Organizer Audit Rights:**

- Request audit of settlement calculations (max once per quarter)
- Platform provides detailed breakdown within 14 business days
- Booking-level detail with IDs and amounts
- Third-party auditor access (with NDA)

### 17.2 Tax Compliance

**Platform's Obligations:**

- File GST returns when applicable (post ₹20L threshold)
- Maintain records for income tax audits
- Issue TDS certificates if deducting tax at source (future)
- Cooperate with tax authorities

**Organizer's Obligations (As Independent Third Party):**

- File own income tax returns
- Report EventsPro earnings in tax filings
- Register for GST if turnover > ₹20 Lakh
- Platform provides settlement reports as documentation

**Tax Documentation Provided:**

- Annual earnings summary per organizer
- Settlement-wise breakdown
- GST invoices (post-GST registration)

### 17.3 Regulatory Compliance

**Platform Complies With:**

- Payment and Settlement Systems Act, 2007
- Prevention of Money Laundering Act (PMLA), 2002
- RBI guidelines for payment aggregators
- Data protection regulations

**Third-Party Organizer Compliance:**

- Event-specific licenses (music, food, alcohol)
- Venue permits and fire safety certificates
- Local municipal regulations
- Labor laws (if hiring event staff)

---

## 18. CONTACT INFORMATION

**General Support:**
Email: support@eventspro.com  
Phone: +91-XXXXXXXXXX  
Hours: 9:00 AM - 9:00 PM IST (Monday-Sunday)

**Settlement Queries:**
Email: settlements@eventspro.com  
Response: Within 24 hours

**Technical Support:**
Email: tech@eventspro.com  
Emergency Hotline: +91-XXXXXXXXXX (24/7)

**Legal & Compliance:**
Email: legal@eventspro.com  
For: Contract disputes, legal notices

**Fraud Reporting:**
Email: fraud@eventspro.com  
Hotline: +91-XXXXXXXXXX (24/7)  
Anonymous reporting supported

**Copyright Issues:**
Email: dmca@eventspro.com  
For: IP infringement claims

**Data Privacy:**
Email: privacy@eventspro.com  
For: Data deletion, access requests

**Registered Office:**
EventsPro  
[Complete Address to be Added]  
Bhopal, Madhya Pradesh - [Pincode]  
India

---

## 19. ACCEPTANCE & ACKNOWLEDGMENT

### 19.1 Organizer Acceptance

By registering as third-party event organizer on EventsPro, you acknowledge:

✅ **Platform Model Understood:** EventsPro is marketplace, not event producer  
✅ **Third-Party Status:** You are independent contractor, not employee/agent  
✅ **Commission Structure:** Agree to 10% platform commission  
✅ **Settlement Terms:** Understand 7-day post-event settlement timeline  
✅ **GST Status:** Aware of current GST policy and future implementation  
✅ **Refund Policy:** Accept cancellation and refund terms  
✅ **Liability Limits:** Understand platform's limited liability as intermediary  
✅ **Event Responsibility:** Accept full responsibility for event execution  
✅ **Legal Compliance:** Will obtain necessary permits and licenses  
✅ **Jurisdiction:** Consent to Bhopal courts and arbitration  
✅ **Indemnification:** Agree to indemnify platform against claims from event failures

### 19.2 Digital Acceptance Proof

- Registration timestamp = legal acceptance
- IP address and device info logged
- Acceptance record retained for 7 years

### 19.3 Organizer Representations

**By Accepting, Organizer Warrants:**

- Legal capacity to enter binding contract (18+ years)
- Authority to bind entity (if registering for business)
- Information provided is accurate and not fraudulent
- Will comply with all laws and regulations
- Not engaged in illegal or prohibited activities
- Will conduct events as advertised

### 19.4 Customer Acceptance

Customers accept by:

- Completing ticket purchase
- Agreeing to terms during checkout
- Acknowledging third-party organizer model
- Understanding platform's intermediary role

---

## APPENDIX A: SETTLEMENT CALCULATION EXAMPLES

### Example 1: Successful Event by Third-Party Organizer

```
Third-Party Organizer: "TechEvents India"
Event: Cloud Computing Workshop
Date: December 15, 2024
Bookings: 50 tickets × ₹2,000 = ₹1,00,000
Platform Fee: 50 × ₹200 = ₹10,000
Total Collected: ₹1,10,000

Settlement Calculation (December 23):
Gross Revenue to Organizer: ₹1,00,000
No Cancellations: ₹0
Platform Commission (10%): ₹10,000

Net Payable to "TechEvents India": ₹90,000

Platform Revenue:
Commission: ₹10,000
Gateway Charges (2%): ₹2,200
Net Platform Revenue: ₹7,800

Transfer Details:
Amount: ₹90,000
Mode: NEFT
Bank: HDFC Bank (TechEvents India account)
UTR: HDFC24120534567
Date: December 23, 2024
```

### Example 2: Event with Customer Cancellations

```
Third-Party Organizer: "Live Music Productions"
Event: Rock Concert
Date: January 10, 2025
Initial Bookings: 200 tickets × ₹1,500 = ₹3,00,000
Customer Cancellations: 20 tickets (72h before event)
Organizer's Policy: 15% cancellation fee, 48h deadline

Cancellation Calculation:
Eligible for Refund: 20 tickets (within 48h deadline)
Base Amount: 20 × ₹1,500 = ₹30,000
Cancellation Fee (15%): 20 × ₹225 = ₹4,500 (organizer retains)
Refund to Customers: 20 × ₹1,275 = ₹25,500
Platform Fee Refunded: 20 × ₹150 = ₹3,000

Settlement Calculation (January 18):
Confirmed Tickets: 180 × ₹1,500 = ₹2,70,000
Cancellation Fee Retained: ₹4,500
Total Organizer Revenue: ₹2,74,500
Platform Commission (10%): ₹27,450

Net Payable to "Live Music Productions": ₹2,47,050

Platform Revenue:
Commission from Confirmed: 180 × ₹150 = ₹27,000
Lost from Cancellations: 20 × ₹150 = ₹3,000 (refunded)
Net Commission: ₹27,000

Junction Table: 180 booking records linked to settlement #447
```

### Example 3: Organizer Cancels Event (Force Majeure)

```
Third-Party Organizer: "Outdoor Events Co."
Event: Summer Music Festival
Date: July 20, 2025
Bookings: 1,000 tickets × ₹1,200 = ₹12,00,000
Platform Fee: 1,000 × ₹120 = ₹1,20,000
Total Collected: ₹13,20,000
Reason: Government lockdown due to health emergency (Force Majeure)

Refund Required:
Customer Refund: ₹13,20,000 (base + platform fee)

Loss Sharing (50-50 per Force Majeure policy):
Total Loss: ₹13,20,000
Organizer Absorbs: ₹6,60,000
Platform Absorbs: ₹6,60,000

Settlement to Organizer: ₹0
(Future settlements deducted: ₹6,60,000 over next events)

Platform Loss: ₹6,60,000
(₹1,20,000 commission waived + ₹5,40,000 shared loss)

Rationale: Neither party at fault; fair loss distribution during unforeseeable government action
```

### Example 4: Fraudulent Organizer (Customer Protection)

```
Third-Party Organizer: "Fake Events Ltd" (fraudulent)
Event: "Celebrity Meet & Greet" (fake event)
Date: November 30, 2024
Bookings: 300 tickets × ₹5,000 = ₹15,00,000
Platform Fee: ₹1,50,000
Total Collected: ₹16,50,000

Event Day: Organizer disappears, no event conducted

Platform Action:
1. Customer Refund Guaranteed: ₹16,50,000 (full amount)
2. Platform Absorbs Loss: ₹16,50,000
3. Organizer Account: Permanently banned
4. Legal Action: Criminal complaint filed
5. Recovery Efforts: Platform pursues organizer legally

Customer Protection: All 300 customers receive full refund within 7 days
Platform Loss: ₹16,50,000 (temporary; recovery pursued)
Organizer Status: Blacklisted, legal proceedings initiated

Note: This demonstrates platform's refund guarantee even when third-party organizer commits fraud
```

---

## APPENDIX B: THIRD-PARTY ORGANIZER VERIFICATION CHECKLIST

### New Organizer Onboarding Requirements

**Step 1: Identity Verification**
□ Valid Government ID (Aadhaar/PAN/Passport)  
□ Photo ID matches profile picture  
□ ID not expired or blacklisted  
□ Name matches bank account holder name

**Step 2: Contact Verification**
□ Email OTP verification completed  
□ Mobile OTP verification completed  
□ Alternate contact provided (optional but recommended)

**Step 3: Business Verification (If Applicable)**
□ Business registration certificate  
□ GST number (if registered)  
□ PAN card (business or individual)  
□ Trade license (for commercial entities)

**Step 4: First Event Documentation**
□ Venue booking confirmation or agreement  
□ Event permit/NOC (if required by local authorities)  
□ Insurance certificate (for 1000+ attendees)  
□ Talent/speaker confirmation (if celebrity involved)

**Step 5: Bank Account Verification**
□ Bank account number and IFSC code  
□ Cancelled cheque or bank statement  
□ Penny-drop verification successful  
□ Account holder name matches organizer profile

**Step 6: Platform Review**
□ Profile completeness (80%+ required)  
□ Event description quality check  
□ Venue existence verified (Google Maps)  
□ Pricing reasonableness assessed  
□ Red flags reviewed (fraud detection)

**Approval Timeline:**

- Standard verification: 1-2 business days
- Complex cases: Up to 5 business days
- Incomplete submissions: Rejected with feedback

**Post-Approval:**

- Organizer receives "Verified" badge
- First event goes live
- Subsequent events auto-approved (unless flagged)

---

## APPENDIX C: FREQUENTLY ASKED QUESTIONS

### For Third-Party Organizers

**Q1: Am I an employee of EventsPro?**
A: No. You are an **independent third-party contractor**. EventsPro provides technology services; you produce and manage events independently.

**Q2: Can EventsPro control my event content or pricing?**
A: No. As independent organizer, you have full control over event details, pricing, and policies. Platform cannot dictate these (except for policy violations like illegal content).

**Q3: What if my event sells poorly? Can I cancel?**
A: Yes, but you must issue full refunds to customers (base + platform fee). Platform waives commission, but poor sales is not force majeure.

**Q4: When do I receive payment?**
A: 7 business days after event completion. This escrow period protects customers from fraud and allows dispute resolution.

**Q5: Can I list the same event on multiple platforms?**
A: Yes. You're not exclusive to EventsPro. Manage seat inventory across platforms to avoid overbooking.

**Q6: Do I need GST registration?**
A: Only if YOUR annual turnover exceeds ₹20 Lakh. Platform's GST status is separate. Consult a tax advisor.

**Q7: What happens if I can't conduct event due to personal emergency?**
A: Personal emergencies are NOT force majeure. You must cancel event, refund customers fully, and platform may charge 5% administrative fee.

**Q8: Can EventsPro promote my event?**
A: Platform uses algorithms for event discovery. High-quality listings, verified badges, and good ratings improve visibility. Paid promotion features planned for future.

**Q9: What if customer claims ticket didn't work at venue?**
A: Verify via QR code scan logs. If ticket valid but you denied entry incorrectly, you're liable for refund. If customer's technical issue, platform assists troubleshooting.

**Q10: Can I transfer my organizer account to someone else?**
A: No. Accounts are non-transferable. New organizer must register separately and undergo verification.

### For Customers

**Q1: Who is organizing the event I'm booking?**
A: Events are organized by **independent third-party organizers**, not EventsPro. Organizer details displayed on event page.

**Q2: Is EventsPro responsible if event is cancelled or poor quality?**
A: Platform facilitates booking but does NOT produce events. Organizer responsible for event quality. Platform assists with refunds per policy.

**Q3: What is the platform fee?**
A: 10% of ticket base price, added to total. Covers payment processing, technology, customer support, and security.

**Q4: Can I get a refund if I can't attend?**
A: Depends on organizer's cancellation policy (displayed on event page). Some allow cancellations with small fee; others are non-refundable.

**Q5: What if organizer cancels event?**
A: You receive 100% refund (base + platform fee) within 5-7 business days. Platform guarantees refund even if organizer disappears.

**Q6: Is my payment secure?**
A: Yes. Platform uses PCI-DSS compliant Razorpay gateway with 256-bit encryption. Card details never stored.

**Q7: I didn't receive my ticket. What do I do?**
A: Check spam folder first. Log in to dashboard and download. Contact support@eventspro.com if issue persists.

**Q8: Can I transfer my ticket to someone else?**
A: Currently non-transferable. Resale feature planned for future.

**Q9: What if I'm denied entry with valid ticket?**
A: Contact support immediately. Platform investigates and facilitates refund if organizer at fault.

**Q10: How do I report a suspicious or fake event?**
A: Click "Report Event" on listing or email fraud@eventspro.com. All reports confidential.

---

## APPENDIX D: COMPARISON - PLATFORM VS PRODUCER MODEL

### EventsPro (Marketplace Platform) vs Traditional Event Company

| Aspect                    | EventsPro Model                          | Traditional Producer Model  |
| ------------------------- | ---------------------------------------- | --------------------------- |
| **Event Ownership**       | Third-party organizers                   | Company owns events         |
| **Event Production**      | Organizers produce                       | Company produces            |
| **Revenue Model**         | 10% commission                           | 100% ticket sales           |
| **Liability**             | Limited (intermediary)                   | Full liability              |
| **Event Control**         | Organizers decide                        | Company controls            |
| **Scalability**           | Unlimited events (any organizer)         | Limited to company capacity |
| **Risk**                  | Distributed (each organizer's risk)      | Company bears all risk      |
| **Quality Control**       | Verification + ratings                   | Direct oversight            |
| **Customer Relationship** | Organizer-primary, platform-facilitation | Company-primary             |
| **Legal Status**          | IT Act intermediary                      | Event producer              |

**EventsPro is like:**

- YouTube (creators upload videos, YouTube provides platform)
- Uber (drivers provide rides, Uber provides app)
- Airbnb (hosts list properties, Airbnb facilitates booking)

**EventsPro is NOT like:**

- Disney (produces own movies and theme parks)
- Live Nation (produces own concerts)
- Professional sports leagues (organize own events)

---

## FINAL DECLARATION

### For Razorpay Payment Gateway Onboarding

**Platform Confirmation:**

EventsPro hereby confirms for Razorpay payment gateway onboarding:

1. ✅ **Non-Producer Status:** EventsPro does NOT produce, own, or organize events listed on platform

2. ✅ **Third-Party Model:** All events created by independent third-party organizers who register on platform

3. ✅ **Intermediary Role:** Platform acts as technology service provider and payment facilitator under IT Act, 2000 Section 79

4. ✅ **Organizer Agreements:** This SLA governs relationship with third-party organizers; organizers are independent contractors

5. ✅ **Customer Protection:** Platform implements verification, escrow, and refund guarantee to protect customers from fraudulent organizers

6. ✅ **Revenue Model:** Platform earns 10% commission on ticket sales; does not share in event profits or sponsorships

7. ✅ **Liability Structure:** Platform liability limited to commission earned; organizers responsible for event execution

8. ✅ **Compliance:** Platform complies with Payment and Settlement Systems Act, IT Act, and applicable RBI guidelines for payment aggregators

**Authorized Signatory:**
[Name]  
[Designation]  
EventsPro  
Date: December 5, 2024

**Company Seal:** [To be affixed]

---

**END OF SERVICE LEVEL AGREEMENT**

---
