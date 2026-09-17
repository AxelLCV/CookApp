-- DropForeignKey
ALTER TABLE "departments_translations" DROP CONSTRAINT "departments_translations_department_id_fkey";

-- DropForeignKey
ALTER TABLE "ingredients_translations" DROP CONSTRAINT "ingredients_translations_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "recipes_translations" DROP CONSTRAINT "recipes_translations_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "ustensils_translations" DROP CONSTRAINT "ustensils_translations_ustensil_id_fkey";

-- CreateIndex
CREATE INDEX "categories_translations_category_id_idx" ON "categories_translations"("category_id");

-- CreateIndex
CREATE INDEX "categories_translations_language_id_idx" ON "categories_translations"("language_id");

-- CreateIndex
CREATE INDEX "conversions_units_base_id_idx" ON "conversions_units"("base_id");

-- CreateIndex
CREATE INDEX "conversions_units_target_id_idx" ON "conversions_units"("target_id");

-- CreateIndex
CREATE INDEX "departments_translations_department_id_idx" ON "departments_translations"("department_id");

-- CreateIndex
CREATE INDEX "departments_translations_language_id_idx" ON "departments_translations"("language_id");

-- CreateIndex
CREATE INDEX "ingredients_department_id_idx" ON "ingredients"("department_id");

-- CreateIndex
CREATE INDEX "ingredients_translations_ingredient_id_idx" ON "ingredients_translations"("ingredient_id");

-- CreateIndex
CREATE INDEX "ingredients_translations_language_id_idx" ON "ingredients_translations"("language_id");

-- CreateIndex
CREATE INDEX "ingredients_units_ingredient_id_idx" ON "ingredients_units"("ingredient_id");

-- CreateIndex
CREATE INDEX "ingredients_units_unit_id_idx" ON "ingredients_units"("unit_id");

-- CreateIndex
CREATE INDEX "languages_code_idx" ON "languages"("code");

-- CreateIndex
CREATE INDEX "languages_locale_idx" ON "languages"("locale");

-- CreateIndex
CREATE INDEX "recipes_author_id_idx" ON "recipes"("author_id");

-- CreateIndex
CREATE INDEX "recipes_isPublished_idx" ON "recipes"("isPublished");

-- CreateIndex
CREATE INDEX "recipes_slug_idx" ON "recipes"("slug");

-- CreateIndex
CREATE INDEX "recipes_created_at_idx" ON "recipes"("created_at");

-- CreateIndex
CREATE INDEX "recipes_ingredients_recipe_id_idx" ON "recipes_ingredients"("recipe_id");

-- CreateIndex
CREATE INDEX "recipes_ingredients_ingredient_id_idx" ON "recipes_ingredients"("ingredient_id");

-- CreateIndex
CREATE INDEX "recipes_ingredients_unit_id_idx" ON "recipes_ingredients"("unit_id");

-- CreateIndex
CREATE INDEX "recipes_tags_recipe_id_idx" ON "recipes_tags"("recipe_id");

-- CreateIndex
CREATE INDEX "recipes_tags_tag_id_idx" ON "recipes_tags"("tag_id");

-- CreateIndex
CREATE INDEX "recipes_translations_recipe_id_idx" ON "recipes_translations"("recipe_id");

-- CreateIndex
CREATE INDEX "recipes_translations_language_id_idx" ON "recipes_translations"("language_id");

-- CreateIndex
CREATE INDEX "recipes_ustensils_recipe_id_idx" ON "recipes_ustensils"("recipe_id");

-- CreateIndex
CREATE INDEX "recipes_ustensils_ustensil_id_idx" ON "recipes_ustensils"("ustensil_id");

-- CreateIndex
CREATE INDEX "recipes_wines_recipe_id_idx" ON "recipes_wines"("recipe_id");

-- CreateIndex
CREATE INDEX "recipes_wines_wine_id_idx" ON "recipes_wines"("wine_id");

-- CreateIndex
CREATE INDEX "reviews_user_id_idx" ON "reviews"("user_id");

-- CreateIndex
CREATE INDEX "reviews_recipe_id_idx" ON "reviews"("recipe_id");

-- CreateIndex
CREATE INDEX "reviews_language_id_idx" ON "reviews"("language_id");

-- CreateIndex
CREATE INDEX "tags_category_id_idx" ON "tags"("category_id");

-- CreateIndex
CREATE INDEX "tags_translations_tag_id_idx" ON "tags_translations"("tag_id");

-- CreateIndex
CREATE INDEX "tags_translations_language_id_idx" ON "tags_translations"("language_id");

-- CreateIndex
CREATE INDEX "units_type_idx" ON "units"("type");

-- CreateIndex
CREATE INDEX "units_translations_unit_id_idx" ON "units_translations"("unit_id");

-- CreateIndex
CREATE INDEX "units_translations_language_id_idx" ON "units_translations"("language_id");

-- CreateIndex
CREATE INDEX "users_language_id_idx" ON "users"("language_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_ingredients_user_id_idx" ON "users_ingredients"("user_id");

-- CreateIndex
CREATE INDEX "users_ingredients_ingredient_id_idx" ON "users_ingredients"("ingredient_id");

-- CreateIndex
CREATE INDEX "users_ingredients_unit_id_idx" ON "users_ingredients"("unit_id");

-- CreateIndex
CREATE INDEX "users_ustensils_user_id_idx" ON "users_ustensils"("user_id");

-- CreateIndex
CREATE INDEX "users_ustensils_ustensil_id_idx" ON "users_ustensils"("ustensil_id");

-- CreateIndex
CREATE INDEX "ustensils_translations_ustensil_id_idx" ON "ustensils_translations"("ustensil_id");

-- CreateIndex
CREATE INDEX "ustensils_translations_language_id_idx" ON "ustensils_translations"("language_id");

-- CreateIndex
CREATE INDEX "wines_translations_wine_id_idx" ON "wines_translations"("wine_id");

-- CreateIndex
CREATE INDEX "wines_translations_language_id_idx" ON "wines_translations"("language_id");

-- AddForeignKey
ALTER TABLE "recipes_translations" ADD CONSTRAINT "recipes_translations_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients_translations" ADD CONSTRAINT "ingredients_translations_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments_translations" ADD CONSTRAINT "departments_translations_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ustensils_translations" ADD CONSTRAINT "ustensils_translations_ustensil_id_fkey" FOREIGN KEY ("ustensil_id") REFERENCES "ustensils"("id") ON DELETE CASCADE ON UPDATE CASCADE;
