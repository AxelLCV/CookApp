import { Router } from "express";
import { validateRequest } from "../../middlewares/index.js";
import {
  createSchema,
  getSchema,
  updateSchema,
  deleteSchema,
  addMemberSchema,
  removeMemberSchema,
  addIngredientSchema,
  updateIngredientSchema,
  removeIngredientSchema,
  addUstensilSchema,
  removeUstensilSchema,
  addShoppingListItemSchema,
  updateShoppingListItemSchema,
  removeShoppingListItemSchema,
} from "../../validators/households.schema.js";
import { householdsController } from "../../controllers/households.controller.js";

const router = Router();

router.post("/", validateRequest(createSchema), householdsController.create);
router.get("/", householdsController.getMine);
router.get("/:id", validateRequest(getSchema), householdsController.get);
router.patch("/:id", validateRequest(updateSchema), householdsController.update);
router.delete("/:id", validateRequest(deleteSchema), householdsController.delete);
router.post("/:id/members", validateRequest(addMemberSchema), householdsController.addMember);
router.delete("/:id/members/:userId", validateRequest(removeMemberSchema), householdsController.removeMember);

router.get("/:id/ingredients", validateRequest(getSchema), householdsController.listIngredients);
router.post("/:id/ingredients", validateRequest(addIngredientSchema), householdsController.addIngredient);
router.patch("/:id/ingredients/:ingredientId", validateRequest(updateIngredientSchema), householdsController.updateIngredient);
router.delete("/:id/ingredients/:ingredientId", validateRequest(removeIngredientSchema), householdsController.removeIngredient);

router.get("/:id/ustensils", validateRequest(getSchema), householdsController.listUstensils);
router.post("/:id/ustensils", validateRequest(addUstensilSchema), householdsController.addUstensil);
router.delete("/:id/ustensils/:ustensilId", validateRequest(removeUstensilSchema), householdsController.removeUstensil);

router.get("/:id/shopping-list", validateRequest(getSchema), householdsController.listShoppingListItems);
router.post("/:id/shopping-list", validateRequest(addShoppingListItemSchema), householdsController.addShoppingListItem);
router.patch("/:id/shopping-list/:itemId", validateRequest(updateShoppingListItemSchema), householdsController.updateShoppingListItem);
router.delete("/:id/shopping-list/:itemId", validateRequest(removeShoppingListItemSchema), householdsController.removeShoppingListItem);

export default router;
