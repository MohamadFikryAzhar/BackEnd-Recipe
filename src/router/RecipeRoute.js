import {RecipeGetController, RecipeController} from '../controllers/RecipeController.js';
import upload from '../helper/UploadCloudinary.js';
import {authenticateUser} from "./../middleware/JwtAuth.js";
import express from "express";

const router = express.Router();

router.get('/recipe/lists', RecipeGetController.allRecipe);
router.get('/recipe/main', RecipeGetController.recipePage);
router.get('/recipe/sorted', RecipeGetController.sortedRecipe);
router.get('/recipe/category', RecipeGetController.categorizedRecipe);
router.get('/recipe/user', RecipeGetController.recipeByUser);
router.get('/recipe', RecipeGetController.recipePageBySearch);
router.get('/recipe/:id/detail', authenticateUser, RecipeGetController.recipePageById);
router.post('/recipe', [authenticateUser, upload.single('image_path')], RecipeController.addRecipe);
router.put('/recipe/:id', [authenticateUser, upload.single('image_path')], RecipeController.updateRecipe);
router.delete('/recipe/:id', authenticateUser, RecipeController.removeRecipe);

export default router;