import { apiKeyMiddleware } from '../../middlewares/apiKey.middleware.js';
import * as userController from '../controllers/userController.js';
import { Router } from 'express';

const router = Router();

router.options('/createUser', (req, res) => {
  // Apenas responda 204 "No Content", que é o que o preflight espera.
  res.sendStatus(204);
});

router.post(
  '/createUser',
  apiKeyMiddleware,
  userController.createUserController,
);
router.get('/getUsers', apiKeyMiddleware, userController.getUsersController);
router.delete(
  '/deleteUser/:id',
  apiKeyMiddleware,
  userController.deleteUserController,
);
router.put(
  '/updateUser/:id',
  apiKeyMiddleware,
  userController.updateUserController,
);

export default router;
