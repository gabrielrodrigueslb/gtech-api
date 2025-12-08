import 'dotenv/config'
import express from 'express';
import pipelineRoutes from './src/routes/pipelineRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import opportunityRoutes from './src/routes/opportunityRoutes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use('/api/crm', pipelineRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);

app.listen(3333, () => {
  console.log('🔥 API rodando em http://localhost:3333');
});
