import { Router } from 'express';
import { criarAgendamento, cancelarAgendamento, getMeusAgendamentos } from '../controllers/agendamento.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', criarAgendamento);
router.delete('/:id', cancelarAgendamento);
router.get('/meus', getMeusAgendamentos);

export default router;
