"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAulas = listAulas;
exports.getAulaById = getAulaById;
const prisma_1 = require("../lib/prisma");
async function listAulas(req, res) {
    try {
        const { modalidadeId } = req.query;
        const currentUserId = req.user?.id;
        const whereClause = {
            status: 'AGENDADA'
        };
        if (modalidadeId && typeof modalidadeId === 'string') {
            whereClause.modalidadeId = modalidadeId;
        }
        const aulas = await prisma_1.prisma.aula.findMany({
            where: whereClause,
            include: {
                modalidade: true,
                agendamentos: {
                    select: {
                        id: true,
                        usuarioId: true,
                        status: true
                    }
                }
            },
            orderBy: {
                dataHora: 'asc'
            }
        });
        const resultado = aulas.map(aula => {
            const confirmados = aula.agendamentos.filter(a => a.status === 'CONFIRMADO').length;
            const vagasRestantes = Math.max(0, aula.capacidade - confirmados);
            const isLotada = vagasRestantes === 0;
            const usuarioAgendamento = currentUserId
                ? aula.agendamentos.find(a => a.usuarioId === currentUserId)
                : null;
            return {
                id: aula.id,
                tipo: aula.tipo,
                instrutor: aula.instrutor,
                sala: aula.sala,
                dataHora: aula.dataHora,
                duracaoMin: aula.duracaoMin,
                capacidade: aula.capacidade,
                confirmados,
                vagasRestantes,
                isLotada,
                modalidade: aula.modalidade,
                usuarioStatus: usuarioAgendamento ? usuarioAgendamento.status : null
            };
        });
        return res.json(resultado);
    }
    catch (error) {
        console.error('Erro ao listar aulas:', error);
        return res.status(500).json({ error: 'Erro ao listar horários e turmas.' });
    }
}
async function getAulaById(req, res) {
    try {
        const id = req.params.id;
        const currentUserId = req.user?.id;
        const aula = await prisma_1.prisma.aula.findUnique({
            where: { id },
            include: {
                modalidade: true,
                agendamentos: {
                    include: {
                        usuario: {
                            select: { id: true, nome: true }
                        }
                    }
                }
            }
        });
        if (!aula) {
            return res.status(404).json({ error: 'Aula não encontrada.' });
        }
        const confirmados = aula.agendamentos.filter(a => a.status === 'CONFIRMADO').length;
        const vagasRestantes = Math.max(0, aula.capacidade - confirmados);
        const usuarioAgendamento = currentUserId
            ? aula.agendamentos.find(a => a.usuarioId === currentUserId)
            : null;
        return res.json({
            id: aula.id,
            tipo: aula.tipo,
            instrutor: aula.instrutor,
            sala: aula.sala,
            dataHora: aula.dataHora,
            duracaoMin: aula.duracaoMin,
            capacidade: aula.capacidade,
            confirmados,
            vagasRestantes,
            isLotada: vagasRestantes === 0,
            modalidade: aula.modalidade,
            usuarioStatus: usuarioAgendamento ? usuarioAgendamento.status : null
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar detalhes da aula.' });
    }
}
