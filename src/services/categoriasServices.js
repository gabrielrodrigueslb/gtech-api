import prisma from '../../lib/prisma.js';

/**
 * Criar categoria
 */
export async function createCategory(data) {
  try {
    return await prisma.categorias.create({
      data: {
        name: data.name,
      },
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }
}

/**
 * Listar categorias
 */
export async function listCategories() {
  try {
    return await prisma.categorias.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    throw error;
  }
}

/**
 * Atualizar categoria
 */
export async function updateCategory(id, data) {
  try {
    return await prisma.categorias.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }
}

/**
 * Deletar categoria
 */
export async function deleteCategory(id) {
  try {
    return await prisma.categorias.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    throw error;
  }
}
