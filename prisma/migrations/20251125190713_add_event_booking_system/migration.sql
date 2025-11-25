-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('user', 'organizer');

-- CreateEnum
CREATE TYPE "event_status" AS ENUM ('draft', 'published', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('confirmed', 'cancelled');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "total_seats" INTEGER NOT NULL,
    "available_seats" INTEGER NOT NULL,
    "status" "event_status" NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 0,
    "event_date" TIMESTAMP(3),
    "organizer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" SERIAL NOT NULL,
    "seat_count" INTEGER NOT NULL,
    "status" "booking_status" NOT NULL DEFAULT 'confirmed',
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "booking_reference" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_organizer_id_idx" ON "event"("organizer_id");

-- CreateIndex
CREATE INDEX "event_status_idx" ON "event"("status");

-- CreateIndex
CREATE INDEX "event_event_date_idx" ON "event"("event_date");

-- CreateIndex
CREATE UNIQUE INDEX "booking_booking_reference_key" ON "booking"("booking_reference");

-- CreateIndex
CREATE INDEX "booking_user_id_idx" ON "booking"("user_id");

-- CreateIndex
CREATE INDEX "booking_event_id_idx" ON "booking"("event_id");

-- CreateIndex
CREATE INDEX "booking_booking_reference_idx" ON "booking"("booking_reference");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
