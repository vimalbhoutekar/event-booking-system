/*
  Warnings:

  - The values [System] on the enum `setting_context` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "setting_context_new" AS ENUM ('user', 'system');
ALTER TABLE "setting" ALTER COLUMN "context" TYPE "setting_context_new" USING ("context"::text::"setting_context_new");
ALTER TYPE "setting_context" RENAME TO "setting_context_old";
ALTER TYPE "setting_context_new" RENAME TO "setting_context";
DROP TYPE "public"."setting_context_old";
COMMIT;
