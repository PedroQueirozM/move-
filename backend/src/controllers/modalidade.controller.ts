import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function listModalidades(_req: Request, res: Response) {
  try {
    const modalidades = await prisma.modalidade.findMany({
      where: { ativa: true },
      include: {
        _count: {
          select: { aulas: true }
        }
      }
    });
    return res.json(modalidades);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar modalidades.' });
  }
}
