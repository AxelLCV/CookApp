-- DropForeignKey
ALTER TABLE "categories_translations" DROP CONSTRAINT "categories_translations_category_id_fkey";

-- DropForeignKey
ALTER TABLE "tags_translations" DROP CONSTRAINT "tags_translations_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "units_translations" DROP CONSTRAINT "units_translations_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "wines_translations" DROP CONSTRAINT "wines_translations_wine_id_fkey";

-- AddForeignKey
ALTER TABLE "units_translations" ADD CONSTRAINT "units_translations_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_translations" ADD CONSTRAINT "tags_translations_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_translations" ADD CONSTRAINT "categories_translations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wines_translations" ADD CONSTRAINT "wines_translations_wine_id_fkey" FOREIGN KEY ("wine_id") REFERENCES "wines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
