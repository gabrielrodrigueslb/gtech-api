import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export async function authMiddleware(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        /* avatar: true, // se existir depois */
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = user;

    next();
  } catch (err) {
    // ADICIONE ESTAS LINHAS PARA VER O ERRO NO TERMINAL DO SERVIDOR
    console.error("❌ ERRO NO AUTH MIDDLEWARE:", err); 
    
    // Dica: Se quiser ver o erro no front temporariamente para debug:
    return res.status(401).json({ error: 'Token inválido', details: err.message });
  }
}
