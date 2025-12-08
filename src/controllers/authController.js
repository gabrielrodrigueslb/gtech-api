import jwt from 'jsonwebtoken';
import { validateUser } from '../services/authService.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await validateUser(email, password);

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, // ✅ localhost = false
      sameSite: 'lax', // ✅ OBRIGATÓRIO para localhost
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export function logout(req, res) {
  res.clearCookie('authToken', {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
});


  res.json({ message: 'Logout realizado' });
}
