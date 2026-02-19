/*
  Warnings:

  - You are about to drop the column `name` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `departments` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `unit_id` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `conversion` on the `recipes_ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `units` table. All the data in the column will be lost.
  - You are about to drop the column `conversion` on the `users_ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ustensils` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `wines` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `wines` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `wines` table. All the data in the column will be lost.
  - Added the required column `unit_id` to the `recipes_ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_id` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `units` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_id` to the `users_ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('ltr', 'rtl');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('WEIGHT', 'VOLUME', 'QUANTITY');

-- DropForeignKey
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_unit_id_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "departments" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "name",
DROP COLUMN "unit_id",
ADD COLUMN     "average_weight" DOUBLE PRECISION,
ADD COLUMN     "density" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "stage",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "recipes_ingredients" DROP COLUMN "conversion",
ADD COLUMN     "unit_id" INTEGER NOT NULL,
ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "language_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "units" DROP COLUMN "name",
ADD COLUMN     "type" "UnitType" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "language_id" INTEGER;

-- AlterTable
ALTER TABLE "users_ingredients" DROP COLUMN "conversion",
ADD COLUMN     "unit_id" INTEGER NOT NULL,
ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ustensils" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "wines" DROP COLUMN "country",
DROP COLUMN "name",
DROP COLUMN "region";

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "native_name" VARCHAR(50) NOT NULL,
    "latin_name" VARCHAR(50) NOT NULL,
    "direction" "Direction" NOT NULL DEFAULT 'ltr',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "fallback" VARCHAR(10),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes_translations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "stage" TEXT[],
    "language_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,

    CONSTRAINT "recipes_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients_translations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,

    CONSTRAINT "ingredients_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units_translations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "unit_id" INTEGER NOT NULL,

    CONSTRAINT "units_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversions_units" (
    "base_id" INTEGER NOT NULL,
    "target_id" INTEGER NOT NULL,
    "factor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "conversions_units_pkey" PRIMARY KEY ("base_id","target_id")
);

-- CreateTable
CREATE TABLE "ingredients_units" (
    "ingredient_id" INTEGER NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ingredients_units_pkey" PRIMARY KEY ("ingredient_id","unit_id")
);

-- CreateTable
CREATE TABLE "departments_translations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,

    CONSTRAINT "departments_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ustensils_translations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "ustensil_id" INTEGER NOT NULL,

    CONSTRAINT "ustensils_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags_translations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "tags_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories_translations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "categories_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wines_translations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "language_id" INTEGER NOT NULL,
    "wine_id" INTEGER NOT NULL,

    CONSTRAINT "wines_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "languages_locale_key" ON "languages"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_translations_recipe_id_language_id_key" ON "recipes_translations"("recipe_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_translations_ingredient_id_language_id_key" ON "ingredients_translations"("ingredient_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "units_translations_unit_id_language_id_key" ON "units_translations"("unit_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_translations_department_id_language_id_key" ON "departments_translations"("department_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "ustensils_translations_ustensil_id_language_id_key" ON "ustensils_translations"("ustensil_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_translations_tag_id_language_id_key" ON "tags_translations"("tag_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_translations_category_id_language_id_key" ON "categories_translations"("category_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "wines_translations_wine_id_language_id_key" ON "wines_translations"("wine_id", "language_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_translations" ADD CONSTRAINT "recipes_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_translations" ADD CONSTRAINT "recipes_translations_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients_translations" ADD CONSTRAINT "ingredients_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients_translations" ADD CONSTRAINT "ingredients_translations_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units_translations" ADD CONSTRAINT "units_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units_translations" ADD CONSTRAINT "units_translations_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversions_units" ADD CONSTRAINT "conversions_units_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversions_units" ADD CONSTRAINT "conversions_units_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients_units" ADD CONSTRAINT "ingredients_units_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients_units" ADD CONSTRAINT "ingredients_units_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments_translations" ADD CONSTRAINT "departments_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments_translations" ADD CONSTRAINT "departments_translations_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ustensils_translations" ADD CONSTRAINT "ustensils_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ustensils_translations" ADD CONSTRAINT "ustensils_translations_ustensil_id_fkey" FOREIGN KEY ("ustensil_id") REFERENCES "ustensils"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_translations" ADD CONSTRAINT "tags_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_translations" ADD CONSTRAINT "tags_translations_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_translations" ADD CONSTRAINT "categories_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_translations" ADD CONSTRAINT "categories_translations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wines_translations" ADD CONSTRAINT "wines_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wines_translations" ADD CONSTRAINT "wines_translations_wine_id_fkey" FOREIGN KEY ("wine_id") REFERENCES "wines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "recipes_ingredients_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_ingredients" ADD CONSTRAINT "users_ingredients_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
