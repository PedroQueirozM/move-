import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Seed do Move+ ---');

  // Limpar dados existentes
  await prisma.agendamento.deleteMany({});
  await prisma.itemFicha.deleteMany({});
  await prisma.fichaTreino.deleteMany({});
  await prisma.notificacao.deleteMany({});
  await prisma.matricula.deleteMany({});
  await prisma.aula.deleteMany({});
  await prisma.modalidade.deleteMany({});
  await prisma.usuario.deleteMany({});

  const senhaComum = await bcrypt.hash('senha123', 10);
  const senhaAdmin = await bcrypt.hash('admin123', 10);

  // 1. Criar Usuários
  const ana = await prisma.usuario.create({
    data: {
      nome: 'Ana Souza',
      email: 'ana@moveplus.com',
      senhaHash: senhaComum,
      papel: 'ALUNO',
      telefone: '(11) 98765-4321',
      objetivo: 'Hipertrofia e condicionamento'
    }
  });

  const bruno = await prisma.usuario.create({
    data: {
      nome: 'Bruno Lima',
      email: 'bruno@moveplus.com',
      senhaHash: senhaComum,
      papel: 'ALUNO',
      telefone: '(11) 97777-8888',
      objetivo: 'Perda de peso e resistência'
    }
  });

  const carlos = await prisma.usuario.create({
    data: {
      nome: 'Carlos Pires',
      email: 'carlos@moveplus.com',
      senhaHash: senhaComum,
      papel: 'ALUNO',
      telefone: '(11) 96666-5555'
    }
  });

  const dani = await prisma.usuario.create({
    data: {
      nome: 'Dani Alves',
      email: 'dani@moveplus.com',
      senhaHash: senhaComum,
      papel: 'ALUNO',
      telefone: '(11) 95555-4444'
    }
  });

  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador Move+',
      email: 'admin@moveplus.com',
      senhaHash: senhaAdmin,
      papel: 'ADMIN',
      telefone: '(11) 99999-0000'
    }
  });

  console.log('✓ Usuários criados: Ana (Ativo), Bruno (Inadimplente), Carlos, Dani e Admin');

  // 2. Criar Modalidades
  const modFuncional = await prisma.modalidade.create({
    data: {
      nome: 'Funcional',
      descricao: 'Treinamento integrado de força, agilidade e equilíbrio dinâmico.',
      imagem: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80'
    }
  });

  const modSpinning = await prisma.modalidade.create({
    data: {
      nome: 'Spinning',
      descricao: 'Ciclismo indoor de alta intensidade para resistência cardiorrespiratória e queima calórica.',
      imagem: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'
    }
  });

  const modYoga = await prisma.modalidade.create({
    data: {
      nome: 'Yoga',
      descricao: 'Alinhamento postural, flexibilidade, controle respiratório e bem-estar mental.',
      imagem: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80'
    }
  });

  const modPilates = await prisma.modalidade.create({
    data: {
      nome: 'Pilates',
      descricao: 'Fortalecimento do core, estabilidade articular e controle muscular consciente.',
      imagem: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80'
    }
  });

  const modAlongamento = await prisma.modalidade.create({
    data: {
      nome: 'Alongamento',
      descricao: 'Soltura miofascial e recuperação da amplitude de movimento articular.',
      imagem: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80'
    }
  });

  const modHidro = await prisma.modalidade.create({
    data: {
      nome: 'Hidroginástica',
      descricao: 'Exercícios aeróbicos aquáticos de baixo impacto nas articulações.',
      imagem: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop&q=80'
    }
  });

  console.log('✓ 6 Modalidades criadas com sucesso');

  // 3. Matrículas (Ana ativa, Bruno inadimplente)
  await prisma.matricula.create({
    data: {
      usuarioId: ana.id,
      modalidadeId: modFuncional.id,
      status: 'ATIVA'
    }
  });

  await prisma.matricula.create({
    data: {
      usuarioId: bruno.id,
      modalidadeId: modFuncional.id,
      status: 'INADIMPLENTE'
    }
  });

  console.log('✓ Matrículas criadas');

  // 4. Criar Aulas (Data simulada: hoje)
  const hoje = new Date();
  const setHour = (h: number, m: number = 0) => {
    const d = new Date(hoje);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const aulaFuncional = await prisma.aula.create({
    data: {
      modalidadeId: modFuncional.id,
      tipo: 'AULA',
      instrutor: 'Prof. Marcos',
      sala: 'Sala 1',
      dataHora: setHour(12, 0),
      duracaoMin: 60,
      capacidade: 20
    }
  });

  const aulaSpinning = await prisma.aula.create({
    data: {
      modalidadeId: modSpinning.id,
      tipo: 'AULA',
      instrutor: 'Prof. Júlia',
      sala: 'Sala 2',
      dataHora: setHour(18, 0),
      duracaoMin: 45,
      capacidade: 20
    }
  });

  const aulaYoga = await prisma.aula.create({
    data: {
      modalidadeId: modYoga.id,
      tipo: 'AULA',
      instrutor: 'Prof. Lia',
      sala: 'Sala 3',
      dataHora: setHour(19, 0),
      duracaoMin: 60,
      capacidade: 20
    }
  });

  const aulaPilates = await prisma.aula.create({
    data: {
      modalidadeId: modPilates.id,
      tipo: 'AULA',
      instrutor: 'Prof. Rita',
      sala: 'Sala 3',
      dataHora: setHour(14, 0),
      duracaoMin: 50,
      capacidade: 15
    }
  });

  const aulaAlongamento = await prisma.aula.create({
    data: {
      modalidadeId: modAlongamento.id,
      tipo: 'AULA',
      instrutor: 'Prof. Lia',
      sala: 'Sala 3',
      dataHora: setHour(11, 59),
      duracaoMin: 45,
      capacidade: 15
    }
  });

  const aulaHidro = await prisma.aula.create({
    data: {
      modalidadeId: modHidro.id,
      tipo: 'AULA',
      instrutor: 'Prof. Caio',
      sala: 'Piscina',
      dataHora: setHour(15, 0),
      duracaoMin: 45,
      capacidade: 15
    }
  });

  console.log('✓ Aulas criadas para hoje');

  // 5. Agendamentos simulados
  // Funcional: Ana, Carlos, Dani e 9 outros (total 12)
  await prisma.agendamento.create({ data: { usuarioId: ana.id, aulaId: aulaFuncional.id, status: 'CONFIRMADO' } });
  await prisma.agendamento.create({ data: { usuarioId: carlos.id, aulaId: aulaFuncional.id, status: 'CONFIRMADO' } });
  await prisma.agendamento.create({ data: { usuarioId: dani.id, aulaId: aulaFuncional.id, status: 'CONFIRMADO' } });

  // Criar alunos extras anônimos para preencher vagas
  for (let i = 1; i <= 9; i++) {
    const extra = await prisma.usuario.create({
      data: {
        nome: `Aluno Convidado ${i}`,
        email: `convidado${i}@moveplus.com`,
        senhaHash: senhaComum,
        papel: 'ALUNO'
      }
    });
    await prisma.agendamento.create({ data: { usuarioId: extra.id, aulaId: aulaFuncional.id, status: 'CONFIRMADO' } });
  }

  // Spinning: Lotação máxima (20 agendados) para demonstrar fila de espera (RF06 / Fila)
  for (let i = 10; i <= 29; i++) {
    const extra = await prisma.usuario.create({
      data: {
        nome: `Ciclista ${i}`,
        email: `ciclista${i}@moveplus.com`,
        senhaHash: senhaComum,
        papel: 'ALUNO'
      }
    });
    await prisma.agendamento.create({ data: { usuarioId: extra.id, aulaId: aulaSpinning.id, status: 'CONFIRMADO' } });
  }

  // Alongamento: Ana agendada (para testar cancelamento com < 2h de antecedência)
  await prisma.agendamento.create({ data: { usuarioId: ana.id, aulaId: aulaAlongamento.id, status: 'CONFIRMADO' } });

  // Hidroginástica: Ana agendada
  await prisma.agendamento.create({ data: { usuarioId: ana.id, aulaId: aulaHidro.id, status: 'CONFIRMADO' } });

  console.log('✓ Agendamentos e lotações simulados com sucesso!');
  console.log('--- Seed Concluído! ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
