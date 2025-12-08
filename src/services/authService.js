import prisma from '../../lib/prisma.js';
import bcrypt from 'bcryptjs';

export async function validateUser(email, password) {
  if (!email) throw new Error('Email do usuário é obrigatório');
  if (!password) throw new Error('Senha do usuário é obrigatória');
  const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Usuário ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Usuário ou senha inválidos');
    }
    return user
}
