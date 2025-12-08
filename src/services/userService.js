import prisma from '../../lib/prisma.js';
import bcrypt from 'bcryptjs';

export async function createUser(name, email, password) {
  if (!name) throw new Error('Nome do usuário é obrigatório');
  if (!email) throw new Error('Email do usuário é obrigatório');
  if (!password) throw new Error('Senha do usuário é obrigatória');

  const exists = await prisma.user.findFirst({ where: { email } });
  if (exists) throw new Error('Usuário com esse email já existe');

  // ✅ CRIANDO O HASH DA SENHA
  const passwordHash = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}

export function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}

export async function deleteUser(id) {
  if (!id) {
    throw new Error('ID do usuário é obrigatório');
  }
  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) {
    throw new Error('Usuário não encontrado');
  }

  return await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function updateUser(id, name, email, password) {
   if (!id) throw new Error('ID do usuário é obrigatório');

  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) throw new Error('Usuário não encontrado');

  let data = { name, email };

  if (password) {
    const passwordHash = await bcrypt.hash(password, 10);
    data.password = passwordHash;
  }

  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}
