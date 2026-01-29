/*
  Warnings:

  - You are about to drop the `users_recipes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users_recipes" DROP CONSTRAINT "users_recipes_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "users_recipes" DROP CONSTRAINT "users_recipes_user_id_fkey";

-- DropTable
DROP TABLE "users_recipes";

-- CreateTable
CREATE TABLE "reviews" (
    "user_id" TEXT NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "note" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("user_id","recipe_id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
