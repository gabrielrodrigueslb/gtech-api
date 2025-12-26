import 'dotenv/config';
import express from 'express';
import pipelineRoutes from './src/routes/pipelineRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import opportunityRoutes from './src/routes/opportunityRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import projetosRoutes from './src/routes/projetosRoutes.js'
import categoriasRoutes from './src/routes/categoriasRoutes.js';

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:3000',
  'https://lintratech.cloud',
  'http://localhost:2006',
  process.env.NEXT_FRONTEND_URL,
];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'A política CORS para este site não permite acesso da origem ' +
          origin;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  }),
);

app.use('/api/crm', pipelineRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/projects', projetosRoutes);
app.use('/api/categories', categoriasRoutes);

app.listen(3333, () => {
  console.log('🔥 API rodando em http://localhost:3333');
});
