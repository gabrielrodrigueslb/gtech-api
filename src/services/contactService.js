import prisma from '../../lib/prisma.js';

export async function createContact(data) {
  if (!data.name) throw new Error('Nome do contato é obrigatório');
  return await prisma.contact.create({
    data: {
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      segment: data.segment || null,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      segment: true,
      createdAt: true,
    },
  });
}

export async function getContactById(id) {
  if (!id) throw new Error('ID do contato é obrigatório');
  const contact = await prisma.contact.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      segment: true,
      createdAt: true,
    },
  });
  if (!contact) throw new Error('Contato não encontrado');
  return contact;
}

export async function updateContact(id, data) {
  if (!id) throw new Error('ID do contato é obrigatório');
  const updateData = { ...data };
  // Remove campos que não devem ser atualizados manualmente ou que não existem
  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.updatedAt;
  return await prisma.contact.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      segment: true,
      createdAt: true,
    },
  });
}

export async function deleteContact(id) {
  if (!id) throw new Error('ID do contato é obrigatório');
  const exists = await prisma.contact.findUnique({ where: { id } });
  if (!exists) throw new Error('Contato não encontrado');
  return await prisma.contact.delete({ where: { id } });
}
export async function getAllContacts() {
  return await prisma.contact.findMany({
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      segment: true,
      createdAt: true,
    },
  });
}
