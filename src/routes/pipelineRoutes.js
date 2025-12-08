import { apiKeyMiddleware } from '../../middlewares/apiKey.middleware.js';
import * as pipelineController from '../controllers/pipelineController.js';
import { Router } from 'express';

const router = Router();

router.options('/createPipeline', (req, res) => {
  // Apenas responda 204 "No Content", que é o que o preflight espera.
  res.sendStatus(204);
});

router.post('/createPipeline', pipelineController.createPipelineController);
router.get('/getPipelines',apiKeyMiddleware, pipelineController.getPipelinesController);
router.delete(
  '/deletePipeline/:id', apiKeyMiddleware,
  pipelineController.deletePipelineController,
);
router.put('/updatePipeline/:id', pipelineController.updatePipelineController);

export default router;