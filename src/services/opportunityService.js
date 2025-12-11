import prisma from '../../lib/prisma.js';

export async function createOpportunity(data) {
  // 1. Validação Básica
  if (!data.title) throw new Error('Título da oportunidade é obrigatório');
  if (!data.pipelineId) throw new Error('Pipeline é obrigatório');
  if (!data.stageId) throw new Error('Estágio é obrigatório');

  // 2. Preparar os dados para o Prisma
  // Usamos 'connect' para vincular a registros existentes (User, Pipeline, Stage, Contact)
  const createData = {
    title: data.title,
    description: data.description || '',
    amount: parseFloat(data.amount || 0), // Garante float
    probability: parseInt(data.probability || 0), // Garante int
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    status: 'OPEN',
    contactNumber: data.contactNumber,
    website:data.website,
    address:data.address,
    
    // Relacionamentos Obrigatórios
    pipeline: { connect: { id: data.pipelineId } },
    stage: { connect: { id: data.stageId } },
    
    // O dono da oportunidade (geralmente quem criou)
    owner: data.ownerId ? { connect: { id: data.ownerId } } : undefined,
  };

  // 3. Vínculo com Contato (Opcional mas recomendado)
  if (data.contactId) {
    createData.contacts = {
      connect: [{ id: data.contactId }] // Array pois é many-to-many no schema
    };
  }

  // 4. Criação retornando o objeto completo para o Front já atualizar a tela
  return await prisma.opportunity.create({
    data: createData,
    include: {
      contacts: {
        select: { id: true, name: true } // Já traz o nome para o card
      },
      stage: true 
    }
  });
}

export async function getOpportunitiesByPipeline(pipelineId) {
  if (!pipelineId) throw new Error('ID do pipeline é obrigatório');

  return await prisma.opportunity.findMany({
    where: { pipelineId },
    // AQUI ESTÁ A PERFORMANCE:
    // Trazemos tudo o que o Kanban precisa em uma única query
    include: {
      contacts: {
        select: { id: true, name: true, phone: true, email: true }
      },
      owner: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOpportunity(id, data) {
    if (!id) throw new Error("ID obrigatório");

    // Copia os dados para manipular
    const updateData = { ...data };
    
    // 1. Tratamento de Estágio (Se existir stageId, conecta. Depois deleta o campo auxiliar)
    if (data.stageId) {
        updateData.stage = { connect: { id: data.stageId } };
    }
    delete updateData.stageId; // <--- OBRIGATÓRIO: Remove do objeto final
    
    // 2. Tratamento de Contato
    if (data.contactId) {
       // Se veio um ID válido, faz a conexão
       updateData.contacts = { connect: [{ id: data.contactId }] };
    }
    // OBRIGATÓRIO: Remove o campo 'contactId' do objeto final
    // Se não remover, o Prisma tenta salvar na coluna 'contactId' que não existe
    delete updateData.contactId; 

    // Remove campos que não devem ser atualizados manualmente ou que não existem
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Se 'amount' vier como string, converte. Se não vier, mantém o que está (undefined não atualiza)
    if (updateData.amount !== undefined) {
        updateData.amount = parseFloat(updateData.amount);
    }
    
    if (updateData.probability !== undefined) {
        updateData.probability = parseInt(updateData.probability);
    }

    if (updateData.dueDate) {
        updateData.dueDate = new Date(updateData.dueDate);
    }

    return await prisma.opportunity.update({
        where: { id },
        data: updateData,
        include: { contacts: true }
    });
}

export async function deleteOpportunity(id) {
    if(!id) throw new Error("ID obrigatório");
    return await prisma.opportunity.delete({ where: { id }});
}