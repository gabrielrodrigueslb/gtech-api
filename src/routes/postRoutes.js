import { Router } from "express";
import { 
  createPostController,
  getAllPostsController,
  getPostBySlugController,
  getPostByIdController,
  updatePostController,
  deletePostController
} from "../controllers/postController.js";

const router = Router();

// Rotas Base
router.post('/', createPostController);         // Criar Post
router.get('/', getAllPostsController);         // Listar Todos (aceita ?status=PUBLISHED)

// Rotas Específicas
router.get('/slug/:slug', getPostBySlugController); // Busca pública (URL amigável)
router.get('/id/:id', getPostByIdController);       // Busca administrativa (pelo ID)

// Rotas de Manipulação por ID
router.put('/:id', updatePostController);       // Editar
router.delete('/:id', deletePostController);    // Excluir

export default router;