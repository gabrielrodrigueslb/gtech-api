import prisma from '../../lib/prisma.js';

/**
 * Normaliza o projeto para response público
 */
function mapProject(project) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    challenge: project.challenge,
    solution: project.solution,
    banner: project.banner,
    images: project.images,
    tags: project.tags,
    technologies: project.technologies,
    year: project.year,
    role: project.role,
    category: {
      id: project.category.id,
      name: project.category.name,
    },
    createdAt: project.createdAt,
  };
}

/**
 * CREATE
 */
export async function createProject(data) {
  if (!data.categoryId) {
    throw new Error('categoryId é obrigatório');
  }

  const project = await prisma.projetos.create({
    data: {
      title: data.title,
      description: data.description,
      challenge: data.challenge,
      solution: data.solution,
      banner: data.banner,
      images: data.images,
      tags: data.tags,
      technologies: data.technologies,
      year: data.year,
      role: data.role,
      categoryId: Number(data.categoryId),
    },
    include: {
      category: true,
    },
  });

  return mapProject(project);
}

/**
 * READ ALL
 */
export async function getAllProjects() {
  const projects = await prisma.projetos.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return projects.map(mapProject);
}

/**
 * READ BY ID
 */
export async function getProjectById(id) {
  const project = await prisma.projetos.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
    },
  });

  if (!project) return null;

  return mapProject(project);
}

/**
 * UPDATE
 */
export async function updateProject(id, data) {
  const updateData = { ...data };

  if (data.categoryId) {
    updateData.categoryId = Number(data.categoryId);
  }

  delete updateData.id;
  delete updateData.createdAt;

  const project = await prisma.projetos.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      category: true,
    },
  });

  return mapProject(project);
}

/**
 * DELETE
 */
export async function deleteProject(id) {
  return prisma.projetos.delete({
    where: { id: Number(id) },
  });
}
