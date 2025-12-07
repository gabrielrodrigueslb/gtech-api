import express from 'express';
import pipelineRoutes from './src/routes/pipelineRoutes.js';


const app = express();
app.use(express.json());

app.use("/crm", pipelineRoutes)

app.listen(3333, () => {
  console.log('🔥 API rodando em http://localhost:3333');
});
