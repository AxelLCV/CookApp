/*
  Warnings:

  - You are about to drop the `users_ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_ustensils` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "HouseholdRole" AS ENUM ('OWNER', 'MEMBER');

-- DropForeignKey
ALTER TABLE "users_ingredients" DROP CONSTRAINT "users_ingredients_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "users_ingredients" DROP CONSTRAINT "users_ingredients_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "users_ingredients" DROP CONSTRAINT "users_ingredients_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users_ustensils" DROP CONSTRAINT "users_ustensils_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users_ustensils" DROP CONSTRAINT "users_ustensils_ustensil_id_fkey";

-- DropTable
DROP TABLE "users_ingredients";

-- DropTable
DROP TABLE "users_ustensils";

-- CreateTable
CREATE TABLE "households" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "households_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "households_members" (
    "household_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "HouseholdRole" NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "households_members_pkey" PRIMARY KEY ("household_id","user_id")
);

-- CreateTable
CREATE TABLE "households_ustensils" (
    "household_id" TEXT NOT NULL,
    "ustensil_id" INTEGER NOT NULL,

    CONSTRAINT "households_ustensils_pkey" PRIMARY KEY ("household_id","ustensil_id")
);

-- CreateTable
CREATE TABLE "households_ingredients" (
    "household_id" TEXT NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "households_ingredients_pkey" PRIMARY KEY ("household_id","ingredient_id")
);

-- CreateIndex
CREATE INDEX "households_members_household_id_idx" ON "households_members"("household_id");

-- CreateIndex
CREATE INDEX "households_members_user_id_idx" ON "households_members"("user_id");

-- CreateIndex
CREATE INDEX "households_ustensils_household_id_idx" ON "households_ustensils"("household_id");

-- CreateIndex
CREATE INDEX "households_ustensils_ustensil_id_idx" ON "households_ustensils"("ustensil_id");

-- CreateIndex
CREATE INDEX "households_ingredients_household_id_idx" ON "households_ingredients"("household_id");

-- CreateIndex
CREATE INDEX "households_ingredients_ingredient_id_idx" ON "households_ingredients"("ingredient_id");

-- CreateIndex
CREATE INDEX "households_ingredients_unit_id_idx" ON "households_ingredients"("unit_id");

-- AddForeignKey
ALTER TABLE "households_members" ADD CONSTRAINT "households_members_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "households_members" ADD CONSTRAINT "households_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "households_ustensils" ADD CONSTRAINT "households_ustensils_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "households_ustensils" ADD CONSTRAINT "households_ustensils_ustensil_id_fkey" FOREIGN KEY ("ustensil_id") REFERENCES "ustensils"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "households_ingredients" ADD CONSTRAINT "households_ingredients_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "households_ingredients" ADD CONSTRAINT "households_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "households_ingredients" ADD CONSTRAINT "households_ingredients_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
