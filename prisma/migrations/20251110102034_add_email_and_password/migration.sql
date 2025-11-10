DROP INDEX "public"."user_name_key";

ALTER TABLE "user" DROP COLUMN "name";

ALTER TABLE "user" 
ADD COLUMN "email" VARCHAR(128) NOT NULL DEFAULT 'temp_email_placeholder';

ALTER TABLE "user" 
ADD COLUMN "password" VARCHAR(255) NOT NULL DEFAULT '$2a$10$tJ9S7R1z7GfBqD8q5uA2F.E8G9oM0vI9rG5S4S7S6Z.G5T1Z5M2T5';

UPDATE "user" SET "email" = 'existing_user_1@temp.com' WHERE "id" = 1;
UPDATE "user" SET "email" = 'existing_user_2@temp.com' WHERE "id" = 2;

ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "password" DROP DEFAULT;

CREATE UNIQUE INDEX "user_email_key" ON "user"("email");