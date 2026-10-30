"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listModalidades = listModalidades;
const prisma_1 = require("../lib/prisma");
async function listModalidades(_req, res) {
    try {
        const modalidades = await prisma_1.prisma.modalidade.findMany({
            where: { ativa: true },
            include: {
                _count: {
                    select: { aulas: true }
                }
            }
        });
        return res.json(modalidades);
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao listar modalidades.' });
    }
}
