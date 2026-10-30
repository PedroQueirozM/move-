import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const RegisterSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  telefone: z.string().optional(),
  objetivo: z.string().optional()
});

const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória')
});

const JWT_SECRET = process.env.JWT_SECRET || 'move_plus_super_secret_jwt_key_2026';

export async function register(req: Request, res: Response) {
  try {
    const data = RegisterSchema.parse(req.body);

    const emailExiste = await prisma.usuario.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (emailExiste) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado no Move+.' });
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email.toLowerCase(),
        senhaHash,
        telefone: data.telefone,
        objetivo: data.objetivo,
        papel: 'ALUNO'
      }
    });

    // Criar matrícula ativa padrão na primeira modalidade disponível
    const primeiraModalidade = await prisma.modalidade.findFirst();
    if (primeiraModalidade) {
      await prisma.matricula.create({
        data: {
          usuarioId: usuario.id,
          modalidadeId: primeiraModalidade.id,
          status: 'ATIVA'
        }
      });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, papel: usuario.papel },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Cadastro realizado com sucesso!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: 'Erro interno ao realizar cadastro.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = LoginSchema.parse(req.body);

    const usuario = await prisma.usuario.findUnique({
      where: { email: data.email.toLowerCase() },
      include: {
        matriculas: true
      }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, papel: usuario.papel },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const matriculaAtiva = usuario.matriculas.some(m => m.status === 'ATIVA');
    const isInadimplente = usuario.matriculas.some(m => m.status === 'INADIMPLENTE');

    return res.json({
      message: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
        matriculaStatus: isInadimplente ? 'INADIMPLENTE' : matriculaAtiva ? 'ATIVA' : 'SEM_MATRICULA'
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        papel: true,
        telefone: true,
        objetivo: true,
        foto: true,
        matriculas: {
          include: { modalidade: true }
        },
        agendamentos: {
          where: { status: 'CONFIRMADO' }
        }
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const isInadimplente = usuario.matriculas.some(m => m.status === 'INADIMPLENTE');
    const isAtiva = usuario.matriculas.some(m => m.status === 'ATIVA');

    return res.json({
      ...usuario,
      matriculaStatus: isInadimplente ? 'INADIMPLENTE' : isAtiva ? 'ATIVA' : 'SEM_MATRICULA'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar perfil do usuário.' });
  }
}

export async function getDemoUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.usuario.findMany({
      where: {
        email: { in: ['ana@moveplus.com', 'bruno@moveplus.com', 'admin@moveplus.com'] }
      },
      select: {
        id: true,
        nome: true,
        email: true,
        papel: true,
        matriculas: true
      }
    });

    const result = users.map(u => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      papel: u.papel,
      status: u.matriculas.some(m => m.status === 'INADIMPLENTE') ? 'INADIMPLENTE' : 'ATIVA'
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar usuários demo.' });
  }
}
