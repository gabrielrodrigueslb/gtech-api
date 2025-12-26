import {
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
} from '../services/categoriasServices.js';

export async function createCategoryController(req, res) {
  try {
    const category = await createCategory(req.body);
    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function listCategoriesController(req, res) {
  try {
    const categories = await listCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function updateCategoryController(req, res) {
  try {
    const { id } = req.params;
    const category = await updateCategory(id, req.body);
    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function deleteCategoryController(req, res) {
  try {
    const { id } = req.params;
    await deleteCategory(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
