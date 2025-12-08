import prisma from '../../lib/prisma.js';
// Importamos o serviço de estágios para reutilizar a lógica de criação e validação
import { createStage } from './stageService.js';

const DEFAULT_STAGES = [
  { name: 'Lead', color: '#F59E0B' },        // Amarelo
  { name: 'Qualificado', color: '#3B82F6' }, // Azul
  { name: 'Proposta', color: '#10B981' },    // Verde
  { name: 'Negociação', color: '#8B5CF6' },  // Roxo
  { name: 'Fechado', color: '#06B6D4' },     // Ciano
];

export async function createPipeline(name, customStages) {
  if (!name) {
    throw new Error('Nome do pipeline é obrigatório');
  }

  const exists = await prisma.pipeline.findFirst({ where: { name } });
  if (exists) throw new Error('Pipeline já existe');

  if (name.length < 3) {
    throw new Error('O nome deve ter no mínimo 3 caracteres');
  }

  // 1. Primeiro criamos o Pipeline para ter o ID
  const newPipeline = await prisma.pipeline.create({ data: { name } });

  try {
    // 2. Definimos quais estágios criar (Customizados ou Padrão)
    const stagesToCreate = (customStages && customStages.length > 0) 
      ? customStages 
      : DEFAULT_STAGES;

    // 3. Iteramos sobre a lista e chamamos o SEU service existente
    // Usamos Promise.all para criar todos em paralelo, aproveitando o index como 'order'
    await Promise.all(stagesToCreate.map(async (stage, index) => {
      await createStage(
        stage.name,           // Nome
        newPipeline.id,       // ID do pipeline recém criado
        stage.color || '#cccccc', // Cor (fallback se vier sem cor no custom)
        index                 // Ordem baseada na posição do array (0, 1, 2...)
      );
    }));

    // 4. Retornamos o pipeline completo com os estágios criados
    return await prisma.pipeline.findUnique({
      where: { id: newPipeline.id },
      include: {
        stages: {
          orderBy: { order: 'asc' }
        }
      }
    });

  } catch (error) {
    // ROLLBACK MANUAL:
    // Se der erro ao criar qualquer estágio (ex: cor inválida validada pelo stageService),
    // nós apagamos o pipeline que acabamos de criar para não ficar um funil vazio no banco.
    await prisma.pipeline.delete({ where: { id: newPipeline.id } });
    
    // Repassa o erro original (ex: "Cor inválida...") para o controller
    throw error;
  }
}

export function getPipelines() {
  return prisma.pipeline.findMany({
    include: {
      stages: {
        orderBy: { order: 'asc' }
      }
    }
  });
}

export async function deletePipeline(id) {
  if (!id) throw new Error('ID do pipeline é obrigatório');

  const exists = await prisma.pipeline.findUnique({ where: { id } });
  if (!exists) throw new Error('Pipeline não encontrado');

  // Transaction para garantir limpeza
  await prisma.stage.deleteMany({ where: { pipelineId: id } });
  await prisma.opportunity.deleteMany({ where: { pipelineId: id } });

  return await prisma.pipeline.delete({ where: { id } });
}

export async function updatePipeline(id, name) {
  if (!id) throw new Error('ID do pipeline é obrigatório');
  if (!name) throw new Error('Nome do pipeline é obrigatório');

  if (name.length < 3) {
    throw new Error('O nome deve ter no mínimo 3 caracteres');
  }

  return await prisma.pipeline.update({
    where: { id },
    data: { name },
    include: { stages: { orderBy: { order: 'asc' } } }
  });
}