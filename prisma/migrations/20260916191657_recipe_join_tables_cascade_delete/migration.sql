-- DropForeignKey
ALTER TABLE "recipes_ingredients" DROP CONSTRAINT "recipes_ingredients_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipes_tags" DROP CONSTRAINT "recipes_tags_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipes_ustensils" DROP CONSTRAINT "recipes_ustensils_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipes_wines" DROP CONSTRAINT "recipes_wines_recipe_id_fkey";

-- AddForeignKey
ALTER TABLE "recipes_wines" ADD CONSTRAINT "recipes_wines_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_tags" ADD CONSTRAINT "recipes_tags_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_ustensils" ADD CONSTRAINT "recipes_ustensils_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "recipes_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
