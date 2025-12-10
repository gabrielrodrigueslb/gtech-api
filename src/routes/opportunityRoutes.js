import { Router } from 'express';
import { 
    createOpportunityController, 
    getByPipelineController, 
    updateOpportunityController, 
    deleteOpportunityController 
} from '../controllers/opportunityController.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js'; // Ajuste o caminho conforme sua pasta
import { apiKeyMiddleware } from '../../middlewares/apiKey.middleware.js';

const router = Router();

// Aplica autenticação em todas as rotas de oportunidades
/* router.use(authMiddleware); */

// Rota: POST /api/opportunities
router.post('/createOpportunity', apiKeyMiddleware, createOpportunityController);

// Rota: GET /api/opportunities/pipeline/:pipelineId
router.get('/pipeline/:pipelineId',authMiddleware, getByPipelineController);

// Rota: PUT /api/opportunities/:id
router.put('/:id',authMiddleware, updateOpportunityController);

// Rota: DELETE /api/opportunities/:id
router.delete('/:id',authMiddleware, deleteOpportunityController);

export default router;