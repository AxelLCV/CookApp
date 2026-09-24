-- AlterTable
ALTER TABLE "recipes_translations" DROP COLUMN "stage";

-- CreateTable
CREATE TABLE "recipes_steps" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "sub_recipe_id" INTEGER,

    CONSTRAINT "recipes_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes_steps_translations" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "step_id" INTEGER NOT NULL,

    CONSTRAINT "recipes_steps_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recipes_steps_recipe_id_idx" ON "recipes_steps"("recipe_id");

-- CreateIndex
CREATE INDEX "recipes_steps_sub_recipe_id_idx" ON "recipes_steps"("sub_recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_steps_recipe_id_position_key" ON "recipes_steps"("recipe_id", "position");

-- CreateIndex
CREATE INDEX "recipes_steps_translations_step_id_idx" ON "recipes_steps_translations"("step_id");

-- CreateIndex
CREATE INDEX "recipes_steps_translations_language_id_idx" ON "recipes_steps_translations"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_steps_translations_step_id_language_id_key" ON "recipes_steps_translations"("step_id", "language_id");

-- AddForeignKey
ALTER TABLE "recipes_steps" ADD CONSTRAINT "recipes_steps_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_steps" ADD CONSTRAINT "recipes_steps_sub_recipe_id_fkey" FOREIGN KEY ("sub_recipe_id") REFERENCES "recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_steps_translations" ADD CONSTRAINT "recipes_steps_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_steps_translations" ADD CONSTRAINT "recipes_steps_translations_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "recipes_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

