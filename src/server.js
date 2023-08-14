import express from "express";
import UserRoute from './router/UserRoute.js';
import RecipeRoute from './router/RecipeRoute.js';
import CategoryRoute from './router/CategoryRoute.js';

const router = express.Router();

router.use('/', UserRoute);
router.use('/', RecipeRoute);
router.use('/tmp', express.static('tmp'))
router.use('/', CategoryRoute);

export default router;