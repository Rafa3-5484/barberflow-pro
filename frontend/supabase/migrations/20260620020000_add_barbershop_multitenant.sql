-- Create Barbershop table
CREATE TABLE IF NOT EXISTS "Barbershop" (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  phone TEXT,
  email TEXT,
  address TEXT,
  logo TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create default barbershop for existing data
INSERT INTO "Barbershop" (id, name, slug, phone, email, active, "createdAt")
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Barbearia Principal',
  'principal',
  NULL,
  NULL,
  true,
  NOW()
);

-- Add barbershopId to User
ALTER TABLE "User" ADD COLUMN "barbershopId" UUID REFERENCES "Barbershop"(id);
UPDATE "User" SET "barbershopId" = '00000000-0000-0000-0000-000000000001';
ALTER TABLE "User" ALTER COLUMN "barbershopId" SET NOT NULL;

-- Add barbershopId to Professional
ALTER TABLE "Professional" ADD COLUMN "barbershopId" UUID REFERENCES "Barbershop"(id);
UPDATE "Professional" SET "barbershopId" = '00000000-0000-0000-0000-000000000001';
ALTER TABLE "Professional" ALTER COLUMN "barbershopId" SET NOT NULL;

-- Add barbershopId to Service
ALTER TABLE "Service" ADD COLUMN "barbershopId" UUID REFERENCES "Barbershop"(id);
UPDATE "Service" SET "barbershopId" = '00000000-0000-0000-0000-000000000001';
ALTER TABLE "Service" ALTER COLUMN "barbershopId" SET NOT NULL;

-- Add barbershopId to Client
ALTER TABLE "Client" ADD COLUMN "barbershopId" UUID REFERENCES "Barbershop"(id);
UPDATE "Client" SET "barbershopId" = '00000000-0000-0000-0000-000000000001';
ALTER TABLE "Client" ALTER COLUMN "barbershopId" SET NOT NULL;

-- Add barbershopId to Appointment
ALTER TABLE "Appointment" ADD COLUMN "barbershopId" UUID REFERENCES "Barbershop"(id);
UPDATE "Appointment" SET "barbershopId" = '00000000-0000-0000-0000-000000000001';
ALTER TABLE "Appointment" ALTER COLUMN "barbershopId" SET NOT NULL;

-- Add barbershopId to CashRegister
ALTER TABLE "CashRegister" ADD COLUMN "barbershopId" UUID REFERENCES "Barbershop"(id);
UPDATE "CashRegister" SET "barbershopId" = '00000000-0000-0000-0000-000000000001';
ALTER TABLE "CashRegister" ALTER COLUMN "barbershopId" SET NOT NULL;

-- Add barbershopId to StockItem
ALTER TABLE "StockItem" ADD COLUMN "barbershopId" UUID REFERENCES "Barbershop"(id);
UPDATE "StockItem" SET "barbershopId" = '00000000-0000-0000-0000-000000000001';
ALTER TABLE "StockItem" ALTER COLUMN "barbershopId" SET NOT NULL;

-- Add barbershopId to Notification
ALTER TABLE "Notification" ADD COLUMN "barbershopId" UUID REFERENCES "Barbershop"(id);
UPDATE "Notification" SET "barbershopId" = '00000000-0000-0000-0000-000000000001';
ALTER TABLE "Notification" ALTER COLUMN "barbershopId" SET NOT NULL;

-- Add barbershopId to Rating
ALTER TABLE "Rating" ADD COLUMN "barbershopId" UUID REFERENCES "Barbershop"(id);
UPDATE "Rating" SET "barbershopId" = '00000000-0000-0000-0000-000000000001';
ALTER TABLE "Rating" ALTER COLUMN "barbershopId" SET NOT NULL;

-- Add barbershopId to Transaction
ALTER TABLE "Transaction" ADD COLUMN "barbershopId" UUID REFERENCES "Barbershop"(id);
UPDATE "Transaction" SET "barbershopId" = '00000000-0000-0000-0000-000000000001';
ALTER TABLE "Transaction" ALTER COLUMN "barbershopId" SET NOT NULL;
