import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import aulaRoutes from './routes/aula.routes';
import agendamentoRoutes from './routes/agendamento.routes';
import modalidadeRoutes from './routes/modalidade.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/aulas', aulaRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/modalidades', modalidadeRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    app: 'Move+ API',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Move+ Backend rodando com sucesso na porta ${PORT}`);
  console.log(`📡 URL base: http://localhost:${PORT}/api`);
});
