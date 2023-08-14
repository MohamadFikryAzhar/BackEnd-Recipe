import * as recipeController from '../controllers/RecipeController.js';
import upload from '../helper/UploadCloudinary.js';
import {authenticateUser} from "./../middleware/JwtAuth.js";
import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    return res.status(200).json({statuscode: 200, message: "REST API FOR RECIPE"});
})
router.get('/recipe/lists', recipeController.allRecipe);
router.get('/recipe/main', recipeController.recipePage);
router.get('/recipe/sorted', recipeController.sortedRecipe);
router.get('/recipe/category', recipeController.categorizedRecipe);
router.get('/recipe/user', recipeController.recipeByUser);
router.get('/recipe', recipeController.recipePageBySearch);
router.get('/recipe/:id/detail', authenticateUser, recipeController.recipePageById);
router.post('/recipe', [authenticateUser, upload.single('image_path')], recipeController.addRecipe);
router.put('/recipe/:id', [authenticateUser, upload.single('image_path')], recipeController.updateRecipe);
router.delete('/recipe/:id', authenticateUser, recipeController.removeRecipe);

export default router;