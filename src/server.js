import express from "express";
import UserRoute from './routes/UserRoute.js';
import RecipeRoute from './routes/RecipeRoute.js';
import CategoryRoute from './routes/CategoryRoute.js';

const router = express.Router();

router.use('/', UserRoute);
router.use('/', RecipeRoute);
router.use('/', CategoryRoute);

export default router;