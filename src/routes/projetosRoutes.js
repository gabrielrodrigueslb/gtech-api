import { 
  createProjectController,
  getAllProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController
} from "../controllers/projetosController.js";
import { Router } from "express";

const router = Router();

// Rotas
router.post('/', createProjectController);       // Criar
router.get('/', getAllProjectsController);       // Listar todos
router.get('/:id', getProjectByIdController);    // Buscar um (para popular form de edição)
router.put('/:id', updateProjectController);     // Editar
router.delete('/:id', deleteProjectController);  // Excluir

export default router;