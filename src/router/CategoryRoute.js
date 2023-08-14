import * as categoryController from './../controllers/CategoryController.js';
import {authenticateUser} from './../middleware/JwtAuth.js';
import express from "express";
const router = express.Router();

router.get("/category", [authenticateUser], categoryController.getCategories);

export default router;