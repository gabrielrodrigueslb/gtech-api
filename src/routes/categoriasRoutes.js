import { Router } from 'express';
import {
  createCategoryController,
  listCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} from '../controllers/categoriasController.js';

const router = Router();

router.options('/', (req, res) => res.sendStatus(204));

router.post('/', createCategoryController);
router.get('/', listCategoriesController);
router.put('/:id', updateCategoryController);
router.delete('/:id', deleteCategoryController);

export default router;
