"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarAgendamento = criarAgendamento;
exports.cancelarAgendamento = cancelarAgendamento;
exports.getMeusAgendamentos = getMeusAgendamentos;
const prisma_1 = require("../lib/prisma");
async function criarAgendamento(req, res) {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        const { aulaId, entrarNaFila } = req.body;
        if (!aulaId || typeof aulaId !== 'string') {
            return res.status(400).json({ error: 'Identificador da aula é obrigatório.' });
        }
        // 1. Verificar se o aluno está inadimplente
        const matriculaInadimplente = await prisma_1.prisma.matricula.findFirst({
            where: {
                usuarioId,
                status: 'INADIMPLENTE'
            }
        });
        if (matriculaInadimplente) {
            return res.status(403).json({
                error: 'Contrato inadimplente. Não foi possível reservar. Procure a recepção para regularizar.',
                code: 'INADIMPLENTE'
            });
        }
        // 2. Transação atômica para evitar overbooking
        const resultado = await prisma_1.prisma.$transaction(async (tx) => {
            const aula = await tx.aula.findUnique({
                where: { id: aulaId },
                include: { modalidade: true }
            });
            if (!aula) {
                throw new Error('AULA_NAO_ENCONTRADA');
            }
            // Verificar agendamento existente do aluno
            const agendamentoExistente = await tx.agendamento.findUnique({
                where: {
                    usuarioId_aulaId: {
                        usuarioId,
                        aulaId
                    }
                }
            });
            if (agendamentoExistente && agendamentoExistente.status === 'CONFIRMADO') {
                throw new Error('JA_INSCRITO');
            }
            // Contar agendamentos confirmados
            const confirmados = await tx.agendamento.count({
                where: {
                    aulaId,
                    status: 'CONFIRMADO'
                }
            });
            const vagasRestantes = aula.capacidade - confirmados;
            if (vagasRestantes > 0) {
                // Vaga disponível: Confirmar agendamento
                let agendamento;
                if (agendamentoExistente) {
                    agendamento = await tx.agendamento.update({
                        where: { id: agendamentoExistente.id },
                        data: { status: 'CONFIRMADO', criadoEm: new Date() }
                    });
                }
                else {
                    agendamento = await tx.agendamento.create({
                        data: {
                            usuarioId,
                            aulaId,
                            status: 'CONFIRMADO'
                        }
                    });
                }
                // Criar notificação para o aluno
                await tx.notificacao.create({
                    data: {
                        usuarioId,
                        titulo: 'Reserva Confirmada',
                        mensagem: `Vaga garantida em ${aula.modalidade.nome}. Apresente seu QR Code na catraca.`
                    }
                });
                return {
                    tipo: 'CONFIRMADO',
                    agendamentoId: agendamento.id,
                    aula: {
                        id: aula.id,
                        nome: aula.modalidade.nome,
                        dataHora: aula.dataHora,
                        instrutor: aula.instrutor,
                        sala: aula.sala
                    },
                    qrCodeToken: `MOVE+CATRACA-${agendamento.id.slice(0, 8).toUpperCase()}`,
                    mensagem: `Vaga garantida em ${aula.modalidade.nome}. Comprovante enviado por notificação.`
                };
            }
            // Aula lotada
            if (entrarNaFila) {
                let agendamentoFila;
                if (agendamentoExistente) {
                    agendamentoFila = await tx.agendamento.update({
                        where: { id: agendamentoExistente.id },
                        data: { status: 'FILA_ESPERA' }
                    });
                }
                else {
                    agendamentoFila = await tx.agendamento.create({
                        data: {
                            usuarioId,
                            aulaId,
                            status: 'FILA_ESPERA'
                        }
                    });
                }
                const posicaoFila = await tx.agendamento.count({
                    where: {
                        aulaId,
                        status: 'FILA_ESPERA',
                        criadoEm: { lte: agendamentoFila.criadoEm }
                    }
                });
                return {
                    tipo: 'FILA_ESPERA',
                    agendamentoId: agendamentoFila.id,
                    posicao: posicaoFila,
                    aula: {
                        id: aula.id,
                        nome: aula.modalidade.nome,
                        dataHora: aula.dataHora
                    },
                    mensagem: `Você está na fila de ${aula.modalidade.nome}. Posição: ${posicaoFila}ª. Você será notificado se uma vaga abrir.`
                };
            }
            throw new Error('AULA_LOTADA');
        });
        return res.status(201).json(resultado);
    }
    catch (error) {
        if (error.message === 'AULA_NAO_ENCONTRADA') {
            return res.status(404).json({ error: 'Aula não encontrada.' });
        }
        if (error.message === 'JA_INSCRITO') {
            return res.status(400).json({ error: 'Você já está inscrito nesta aula.' });
        }
        if (error.message === 'AULA_LOTADA') {
            return res.status(409).json({
                error: 'Aula lotada. Entre na fila de espera para ser avisado se uma vaga abrir.',
                lotada: true
            });
        }
        console.error('Erro na transação de agendamento:', error);
        return res.status(500).json({ error: 'Erro ao processar reserva.' });
    }
}
async function cancelarAgendamento(req, res) {
    try {
        const usuarioId = req.user?.id;
        const targetId = String(req.params.id);
        // Buscar agendamento por ID ou por ID da aula associada ao aluno
        const agendamento = await prisma_1.prisma.agendamento.findFirst({
            where: {
                OR: [
                    { id: targetId, usuarioId },
                    { aulaId: targetId, usuarioId }
                ],
                status: { in: ['CONFIRMADO', 'FILA_ESPERA'] }
            },
            include: {
                aula: {
                    include: { modalidade: true }
                }
            }
        });
        if (!agendamento) {
            return res.status(404).json({ error: 'Agendamento não encontrado para este aluno.' });
        }
        // Regra de cancelamento: se confirmado, deve ser no mínimo 2 horas (120 min) antes
        if (agendamento.status === 'CONFIRMADO') {
            const agora = new Date();
            const horaAula = new Date(agendamento.aula.dataHora);
            const diffMinutos = (horaAula.getTime() - agora.getTime()) / (1000 * 60);
            const LIMITE_MINUTOS = 120; // 2 horas
            if (diffMinutos < LIMITE_MINUTOS) {
                return res.status(400).json({
                    error: `Faltam menos de 2h para ${agendamento.aula.modalidade.nome}. O cancelamento só é aceito até 2h antes. Se não comparecer, será registrada falta.`,
                    code: 'PRAZO_EXPIRADO'
                });
            }
        }
        // Executar cancelamento em transação e verificar se promove o primeiro da fila
        const resultado = await prisma_1.prisma.$transaction(async (tx) => {
            await tx.agendamento.update({
                where: { id: agendamento.id },
                data: { status: 'CANCELADO' }
            });
            // Se havia alguém na fila de espera, promover o primeiro da fila
            let promovido = null;
            const primeiroFila = await tx.agendamento.findFirst({
                where: {
                    aulaId: agendamento.aulaId,
                    status: 'FILA_ESPERA'
                },
                orderBy: { criadoEm: 'asc' }
            });
            if (primeiroFila) {
                promovido = await tx.agendamento.update({
                    where: { id: primeiroFila.id },
                    data: { status: 'CONFIRMADO' }
                });
                await tx.notificacao.create({
                    data: {
                        usuarioId: primeiroFila.usuarioId,
                        titulo: 'Vaga Liberada!',
                        mensagem: `Uma vaga abriu em ${agendamento.aula.modalidade.nome} e sua reserva foi confirmada!`
                    }
                });
            }
            return {
                mensagem: `Cancelamento de ${agendamento.aula.modalidade.nome} realizado. A vaga foi liberada.`,
                promovido: !!promovido
            };
        });
        return res.json(resultado);
    }
    catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        return res.status(500).json({ error: 'Erro ao processar cancelamento.' });
    }
}
async function getMeusAgendamentos(req, res) {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        const agendamentos = await prisma_1.prisma.agendamento.findMany({
            where: {
                usuarioId,
                status: { in: ['CONFIRMADO', 'FILA_ESPERA'] }
            },
            include: {
                aula: {
                    include: { modalidade: true }
                }
            },
            orderBy: {
                aula: { dataHora: 'asc' }
            }
        });
        const formatados = agendamentos.map(a => ({
            id: a.id,
            aulaId: a.aulaId,
            modalidadeNome: a.aula.modalidade.nome,
            instrutor: a.aula.instrutor,
            sala: a.aula.sala,
            dataHora: a.aula.dataHora,
            duracaoMin: a.aula.duracaoMin,
            status: a.status,
            criadoEm: a.criadoEm
        }));
        return res.json(formatados);
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar agendamentos do aluno.' });
    }
}
