import { Router } from 'express';
import { listAulas, getAulaById } from '../controllers/aula.controller';

const router = Router();

// Permite listar mesmo sem auth, mas se houver token identifica status do aluno
router.get('/', listAulas);
router.get('/:id', getAulaById);

export default router;
