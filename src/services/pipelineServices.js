import prisma from '../../lib/prisma.js';

export async function createPipeline(name) {
  if (!name) {
    throw new Error('Nome do pipeline é obrigatório');
  }
  const exists = await prisma.pipeline.findFirst({ where: { name } });
  if (exists) throw new Error('Pipeline já existe');

  if (name.length < 3) {
    throw new Error('O nome deve ter no mínimo 3 caracteres');
  }

  return await prisma.pipeline.create({ data: { name: name } });
}

export function getPipelines() {
  return prisma.pipeline.findMany();
}

export async function deletePipeline(id) {
  if (!id) {
    throw new Error('ID do pipeline é obrigatório');
  }

  const exists = await prisma.pipeline.findUnique({ where: { id } });
  if (!exists) {
    throw new Error('Pipeline não encontrado');
  }

  await prisma.stage.deleteMany({ where: { pipelineId: id } });

  await prisma.opportunity.deleteMany({ where: { pipelineId: id } });

  return await prisma.pipeline.delete({ where: { id } });
}

export async function updatePipeline(id, name) {
  if (!id) {
    throw new Error('ID do pipeline é obrigatório');
  }
  if (!name) {
    throw new Error('Nome do pipeline é obrigatório');
  }
  const exists = await prisma.pipeline.findUnique({ where: { id } });
  if (!exists) {
    throw new Error('Pipeline não encontrado');
  }
  if (name.length < 3) {
    throw new Error('O nome deve ter no mínimo 3 caracteres');
  }
  return await prisma.pipeline.update({
    where: { id },
    data: { name },
  });
}
