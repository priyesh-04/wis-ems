import express from 'express';
const router = express.Router();
import {registerController, loginController, userController, refreshTokenController, taskAsignController} from '../controllers';
import { auth } from '../middlewares';

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/profile', auth, userController.profile);
router.post('/refreshtoken', refreshTokenController.refresh);
router.post('/logout', auth, loginController.logout);

router.post('/taskAsign', auth, taskAsignController.taskAsign);

export default router;