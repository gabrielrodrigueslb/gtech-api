import prisma from '../../lib/prisma.js';

export async function createStage(name, pipelineId, color, order) {
  if (!name) {
    throw new Error('Nome do estágio é obrigatório');
  }
  if (!pipelineId) {
    throw new Error('ID do pipeline é obrigatório');
  }
  if (name.length < 2) {
    throw new Error('O nome deve ter no mínimo 2 caracteres');
  }
  if (color && !/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    throw new Error(
      'Cor inválida. Use o formato hexadecimal, por exemplo, #FF5733',
    );
  }

  if (order !== undefined && (!Number.isInteger(order) || order < 0)) {
    throw new Error('Ordem inválida. Deve ser um número inteiro não negativo');
  }
  const pipelineExists = await prisma.pipeline.findUnique({
    where: { id: pipelineId },
  });
  if (!pipelineExists) {
    throw new Error('Pipeline não encontrado');
  }
  return await prisma.stage.create({
    data: { name, pipelineId, color, order },
    select: {
      id: true,
      name: true,
      order: true,
      color: true,
      pipelineId: true,
    },
  });
}

export async function getStagesByPipeline(pipelineId) {
  if (!pipelineId) {
    throw new Error('ID do pipeline é obrigatório');
  }
  return await prisma.stage.findMany({
    where: { pipelineId },
    select: {
      id: true,
      name: true,
      pipelineId: true,
      color: true,
      order: true,
    },
  });
}

export async function deleteStage(id) {
  if (!id) {
    throw new Error('ID do estágio é obrigatório');
  }
  const exists = await prisma.stage.findUnique({ where: { id } });
  if (!exists) {
    throw new Error('Estágio não encontrado');
  }
  return await prisma.stage.delete({ where: { id } });
}

export async function updateStage(id, name, color, order) {
  if (!id) {
    throw new Error('ID do estágio é obrigatório');
  }
  const exists = await prisma.stage.findUnique({ where: { id } });
  if (!exists) {
    throw new Error('Estágio não encontrado');
  }
  if (name && name.length < 2) {
    throw new Error('O nome deve ter no mínimo 2 caracteres');
  }
  if (color && !/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    throw new Error(
      'Cor inválida. Use o formato hexadecimal, por exemplo, #FF5733',
    );
  }
  let data = {};
  if (name) data.name = name;
  if (color) data.color = color;
  if (order !== undefined) {
    if (!Number.isInteger(order) || order < 0) {
      throw new Error(
        'Ordem inválida. Deve ser um número inteiro não negativo',
      );
    }
    data.order = order;
  }
  return await prisma.stage.update({
    where: { id },
    data,
  });
}
