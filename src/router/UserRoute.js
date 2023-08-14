import {ActionUserController, UserController} from './../controllers/UserController.js';
import {checkingDuplicateNameEmail} from './../middleware/VerifySignup.js';
import {authenticateUser} from './../middleware/JwtAuth.js';
import express from "express";
import upload from '../helper/UploadCloudinary.js';

const router = express.Router();

router.get('/list/account', UserController.getUsers);
router.get('/account', authenticateUser, UserController.getUser);
router.post('/register', checkingDuplicateNameEmail, UserController.registerUser);
router.get('/verify/:id', ActionUserController.activateUser);
router.post('/login', UserController.loginUser);
router.put('/account', [authenticateUser, upload.single('photo')], UserController.editUser);
router.delete('/account', authenticateUser, UserController.removeUser);

export default router;