CREATE TABLE IF NOT EXISTS "Users" ();
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "id" SERIAL PRIMARY KEY;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "google_id" text;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "name" text NOT NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "email_id" text NOT NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "access_token" text NOT NULL;
