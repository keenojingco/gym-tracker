import express from 'express';
import * as userController from '../controllers/userController';
import auth from '../middlewares/auth';

const router = express.Router();

router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/:username').get(userController.getUser);

export default router;