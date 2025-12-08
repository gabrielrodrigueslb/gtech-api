import { Router } from 'express';
import {
  createContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
  deleteContactController,
} from '../controllers/contactController.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

router.options('/createContact', (req, res) => {
  // Apenas responda 204 "No Content", que é o que o preflight espera.
  res.sendStatus(204);
});

// Aplica autenticação em todas as rotas de contatos
router.use(authMiddleware);

// Rota: POST /api/contacts/createContact
router.post('/createContact', createContactController);

// Rota: GET /api/contacts
router.get('/', getAllContactsController);
// Rota: GET /api/contacts/:id
router.get('/:id', getContactByIdController);
// Rota: PUT /api/contacts/:id
router.put('/:id', updateContactController);
// Rota: DELETE /api/contacts/:id
router.delete('/:id', deleteContactController);

export default router;