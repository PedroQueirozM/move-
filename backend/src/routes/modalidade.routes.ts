import { Router } from 'express';
import { listModalidades } from '../controllers/modalidade.controller';

const router = Router();

router.get('/', listModalidades);

export default router;
