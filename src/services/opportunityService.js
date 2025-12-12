import prisma from '../../lib/prisma.js';

export async function createOpportunity(data) {
  if (!data.title) throw new Error('Título da oportunidade é obrigatório');
  if (!data.pipelineId) throw new Error('Pipeline é obrigatório');
  if (!data.stageId) throw new Error('Estágio é obrigatório');

  const createData = {
    title: data.title,
    description: data.description || '',
    amount: parseFloat(data.amount || 0),
    probability: parseInt(data.probability || 0),
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    status: 'OPEN',
    // Campos novos
    contactNumber: data.contactNumber || null,
    website: data.website || null,
    address: data.address || null,

    pipeline: { connect: { id: data.pipelineId } },
    stage: { connect: { id: data.stageId } },
    owner: data.ownerId ? { connect: { id: data.ownerId } } : undefined,
  };

  if (data.contactId) {
    createData.contacts = {
      connect: [{ id: data.contactId }],
    };
  }

  return await prisma.opportunity.create({
    data: createData,
    include: {
      contacts: { select: { id: true, name: true } },
      stage: true,
    },
  });
}

export async function getOpportunitiesByPipeline(pipelineId) {
  if (!pipelineId) throw new Error('ID do pipeline é obrigatório');

  return await prisma.opportunity.findMany({
    where: { pipelineId },
    include: {
      contacts: {
        select: { id: true, name: true, phone: true, email: true },
      },
      owner: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOpportunity(id, data) {
  if (!id) throw new Error('ID obrigatório');

  // 1. Clona o objeto para manipulação
  const updateData = { ...data };

  // 2. Limpeza de campos de sistema e IDs relacionais brutos
  // (Precisamos removê-los para não conflitar com os 'connect' abaixo)
  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.updatedAt;
  
  // Remove IDs que serão tratados via 'connect'
  delete updateData.pipelineId;
  delete updateData.stageId;
  delete updateData.contactId; 
  delete updateData.ownerId; // <-- Importante remover este também

  // 3. Tratamento de Relacionamentos (Conexões)
  
  // Pipeline
  if (data.pipelineId) {
    updateData.pipeline = { connect: { id: data.pipelineId } };
  }

  // Estágio
  if (data.stageId) {
    updateData.stage = { connect: { id: data.stageId } };
  }

  // Responsável (Owner) - Faltava essa lógica
  if (data.ownerId) {
    updateData.owner = { connect: { id: data.ownerId } };
  }

  // Contato
  if (data.contactId) {
    updateData.contacts = { connect: [{ id: data.contactId }] };
  }

  // 4. Formatação de Tipos
  if (updateData.amount !== undefined) {
    updateData.amount = parseFloat(updateData.amount);
  }

  if (updateData.probability !== undefined) {
    updateData.probability = parseInt(updateData.probability);
  }

  if (updateData.dueDate) {
    updateData.dueDate = new Date(updateData.dueDate);
  }

  // 5. Atualização
  return await prisma.opportunity.update({
    where: { id },
    data: updateData,
    include: { contacts: true },
  });
}

export async function deleteOpportunity(id) {
  if (!id) throw new Error('ID obrigatório');
  return await prisma.opportunity.delete({ where: { id } });
}
