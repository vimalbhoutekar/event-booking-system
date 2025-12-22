-- CreateEnum
CREATE TYPE "admin_status" AS ENUM ('active');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'blocked');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('user', 'organizer');

-- CreateEnum
CREATE TYPE "otp_transport" AS ENUM ('email', 'mobile');

-- CreateEnum
CREATE TYPE "setting_type" AS ENUM ('binary', 'multi_select', 'single_select');

-- CreateEnum
CREATE TYPE "setting_context" AS ENUM ('user', 'System');

-- CreateEnum
CREATE TYPE "event_status" AS ENUM ('draft', 'published', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "event_category" AS ENUM ('concert', 'sports', 'conference', 'workshop', 'exhibition', 'theater', 'comedy', 'music', 'other');

-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('pending', 'confirmed', 'expired', 'cancelled', 'refunded', 'attended');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "refund_status" AS ENUM ('pending', 'approved', 'rejected', 'processed');

-- CreateEnum
CREATE TYPE "settlement_status" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "organizer_verification_status" AS ENUM ('pending', 'verified', 'rejected');

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_image" TEXT,
    "status" "admin_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_meta" (
    "password_salt" TEXT,
    "password_hash" TEXT,
    "admin_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "dial_code" TEXT,
    "mobile" TEXT,
    "profile_image" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,
    "status" "user_status" NOT NULL DEFAULT 'active',
    "role" "user_role" NOT NULL DEFAULT 'user',
    "organizer_verification_status" "organizer_verification_status",
    "business_name" TEXT,
    "gst_number" TEXT,
    "pan_number" TEXT,
    "bank_account_number" TEXT,
    "bank_ifsc_code" TEXT,
    "bank_account_holder_name" TEXT,
    "bank_name" TEXT,
    "documents" JSONB,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_meta" (
    "google_id" TEXT,
    "password_salt" TEXT,
    "password_hash" TEXT,
    "user_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "otp" (
    "code" TEXT NOT NULL,
    "attempt" SMALLINT NOT NULL DEFAULT 1,
    "last_sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retries" SMALLINT NOT NULL DEFAULT 0,
    "transport" "otp_transport" NOT NULL,
    "target" TEXT NOT NULL,
    "last_code_verified" BOOLEAN NOT NULL DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "setting" (
    "id" SERIAL NOT NULL,
    "mapped_to" TEXT NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "type" "setting_type" NOT NULL,
    "context" "setting_context" NOT NULL,
    "default" JSONB NOT NULL,
    "is_defined_options" BOOLEAN NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting_option" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL,
    "setting_id" INTEGER NOT NULL,

    CONSTRAINT "setting_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_setting" (
    "selection" JSONB NOT NULL,
    "user_id" INTEGER NOT NULL,
    "setting_id" INTEGER NOT NULL,

    CONSTRAINT "user_setting_pkey" PRIMARY KEY ("user_id","setting_id")
);

-- CreateTable
CREATE TABLE "system_setting" (
    "selection" JSONB NOT NULL,
    "setting_id" INTEGER NOT NULL,

    CONSTRAINT "system_setting_pkey" PRIMARY KEY ("setting_id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "total_seats" INTEGER NOT NULL,
    "available_seats" INTEGER NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "platform_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "final_price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "category" "event_category" NOT NULL DEFAULT 'other',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "venue" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pincode" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "cover_image" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "video_url" TEXT,
    "event_date" TIMESTAMP(3),
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "duration" INTEGER,
    "cancellation_allowed" BOOLEAN NOT NULL DEFAULT true,
    "cancellation_deadline" INTEGER,
    "cancellation_charges" DECIMAL(5,2) DEFAULT 0,
    "status" "event_status" NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 0,
    "total_bookings" INTEGER NOT NULL DEFAULT 0,
    "total_revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "organizer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" SERIAL NOT NULL,
    "seat_count" INTEGER NOT NULL,
    "status" "booking_status" NOT NULL DEFAULT 'pending',
    "booking_reference" TEXT NOT NULL,
    "idempotency_key" TEXT,
    "attendee_name" TEXT,
    "attendee_email" TEXT,
    "attendee_phone" TEXT,
    "base_amount" DECIMAL(10,2) NOT NULL,
    "platform_fee" DECIMAL(10,2) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "organizer_amount" DECIMAL(10,2) NOT NULL,
    "qr_code" TEXT,
    "qr_code_data" TEXT,
    "ticket_url" TEXT,
    "is_scanned" BOOLEAN NOT NULL DEFAULT false,
    "scanned_at" TIMESTAMP(3),
    "scanned_by" INTEGER,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "confirmed_at" TIMESTAMP(3),

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "payment_status" NOT NULL DEFAULT 'pending',
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "razorpay_signature" TEXT,
    "payment_method" TEXT,
    "card_last4" TEXT,
    "card_network" TEXT,
    "bank_name" TEXT,
    "upi_id" TEXT,
    "wallet_name" TEXT,
    "failure_reason" TEXT,
    "failure_code" TEXT,
    "error_description" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cancellation" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "reason" TEXT,
    "cancelled_by" TEXT NOT NULL,
    "original_amount" DECIMAL(10,2) NOT NULL,
    "cancellation_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "refund_amount" DECIMAL(10,2) NOT NULL,
    "platform_fee_refunded" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "refund_status" "refund_status" NOT NULL DEFAULT 'pending',
    "refund_id" TEXT,
    "refund_processed_at" TIMESTAMP(3),
    "reviewed_by" INTEGER,
    "review_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cancellation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlement" (
    "id" SERIAL NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "total_bookings" INTEGER NOT NULL,
    "gross_amount" DECIMAL(12,2) NOT NULL,
    "platform_commission" DECIMAL(12,2) NOT NULL,
    "payable_amount" DECIMAL(12,2) NOT NULL,
    "refund_deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "other_deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "settlement_status" NOT NULL DEFAULT 'pending',
    "payment_mode" TEXT,
    "transaction_id" TEXT,
    "account_number" TEXT,
    "ifsc_code" TEXT,
    "processed_by" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "settled_at" TIMESTAMP(3),

    CONSTRAINT "settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlement_booking" (
    "id" SERIAL NOT NULL,
    "settlement_id" INTEGER NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "commission" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settlement_booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_meta_admin_id_key" ON "admin_meta"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_mobile_key" ON "user"("mobile");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE INDEX "user_organizer_verification_status_idx" ON "user"("organizer_verification_status");

-- CreateIndex
CREATE INDEX "user_is_deleted_idx" ON "user"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "user_meta_google_id_key" ON "user_meta"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_meta_user_id_key" ON "user_meta"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "otp_transport_target_key" ON "otp"("transport", "target");

-- CreateIndex
CREATE UNIQUE INDEX "setting_context_mapped_to_key" ON "setting"("context", "mapped_to");

-- CreateIndex
CREATE UNIQUE INDEX "setting_option_setting_id_value_key" ON "setting_option"("setting_id", "value");

-- CreateIndex
CREATE INDEX "event_organizer_id_idx" ON "event"("organizer_id");

-- CreateIndex
CREATE INDEX "event_status_idx" ON "event"("status");

-- CreateIndex
CREATE INDEX "event_category_idx" ON "event"("category");

-- CreateIndex
CREATE INDEX "event_event_date_idx" ON "event"("event_date");

-- CreateIndex
CREATE INDEX "event_city_idx" ON "event"("city");

-- CreateIndex
CREATE INDEX "event_is_deleted_idx" ON "event"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "booking_booking_reference_key" ON "booking"("booking_reference");

-- CreateIndex
CREATE UNIQUE INDEX "booking_idempotency_key_key" ON "booking"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "booking_qr_code_key" ON "booking"("qr_code");

-- CreateIndex
CREATE INDEX "booking_user_id_idx" ON "booking"("user_id");

-- CreateIndex
CREATE INDEX "booking_event_id_idx" ON "booking"("event_id");

-- CreateIndex
CREATE INDEX "booking_booking_reference_idx" ON "booking"("booking_reference");

-- CreateIndex
CREATE INDEX "booking_status_idx" ON "booking"("status");

-- CreateIndex
CREATE INDEX "booking_expires_at_idx" ON "booking"("expires_at");

-- CreateIndex
CREATE INDEX "booking_qr_code_idx" ON "booking"("qr_code");

-- CreateIndex
CREATE INDEX "booking_idempotency_key_idx" ON "booking"("idempotency_key");

-- CreateIndex
CREATE INDEX "booking_is_deleted_idx" ON "booking"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "payment_booking_id_key" ON "payment"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_razorpay_order_id_key" ON "payment"("razorpay_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_razorpay_payment_id_key" ON "payment"("razorpay_payment_id");

-- CreateIndex
CREATE INDEX "payment_razorpay_order_id_idx" ON "payment"("razorpay_order_id");

-- CreateIndex
CREATE INDEX "payment_razorpay_payment_id_idx" ON "payment"("razorpay_payment_id");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "cancellation_booking_id_key" ON "cancellation"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "cancellation_refund_id_key" ON "cancellation"("refund_id");

-- CreateIndex
CREATE INDEX "cancellation_refund_status_idx" ON "cancellation"("refund_status");

-- CreateIndex
CREATE INDEX "cancellation_booking_id_idx" ON "cancellation"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "settlement_transaction_id_key" ON "settlement"("transaction_id");

-- CreateIndex
CREATE INDEX "settlement_organizer_id_idx" ON "settlement"("organizer_id");

-- CreateIndex
CREATE INDEX "settlement_status_idx" ON "settlement"("status");

-- CreateIndex
CREATE INDEX "settlement_period_start_idx" ON "settlement"("period_start");

-- CreateIndex
CREATE INDEX "settlement_period_end_idx" ON "settlement"("period_end");

-- CreateIndex
CREATE INDEX "settlement_booking_settlement_id_idx" ON "settlement_booking"("settlement_id");

-- CreateIndex
CREATE INDEX "settlement_booking_booking_id_idx" ON "settlement_booking"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "settlement_booking_settlement_id_booking_id_key" ON "settlement_booking"("settlement_id", "booking_id");

-- AddForeignKey
ALTER TABLE "admin_meta" ADD CONSTRAINT "admin_meta_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_meta" ADD CONSTRAINT "user_meta_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting" ADD CONSTRAINT "setting_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "setting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting_option" ADD CONSTRAINT "setting_option_setting_id_fkey" FOREIGN KEY ("setting_id") REFERENCES "setting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_setting" ADD CONSTRAINT "user_setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_setting" ADD CONSTRAINT "user_setting_setting_id_fkey" FOREIGN KEY ("setting_id") REFERENCES "setting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_setting" ADD CONSTRAINT "system_setting_setting_id_fkey" FOREIGN KEY ("setting_id") REFERENCES "setting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cancellation" ADD CONSTRAINT "cancellation_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement" ADD CONSTRAINT "settlement_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_booking" ADD CONSTRAINT "settlement_booking_settlement_id_fkey" FOREIGN KEY ("settlement_id") REFERENCES "settlement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_booking" ADD CONSTRAINT "settlement_booking_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
