export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: 'ALUNO' | 'ADMIN' | 'INSTRUTOR';
  telefone?: string;
  objetivo?: string;
  matriculaStatus?: 'ATIVA' | 'INADIMPLENTE' | 'SEM_MATRICULA';
}

export interface Modalidade {
  id: string;
  nome: string;
  descricao?: string;
  imagem?: string;
  ativa: boolean;
}

export interface Aula {
  id: string;
  tipo: 'AULA' | 'AVALIACAO';
  instrutor: string;
  sala: string;
  dataHora: string;
  duracaoMin: number;
  capacidade: number;
  confirmados: number;
  vagasRestantes: number;
  isLotada: boolean;
  modalidade: Modalidade;
  usuarioStatus?: 'CONFIRMADO' | 'FILA_ESPERA' | null;
}

export interface Agendamento {
  id: string;
  aulaId: string;
  modalidadeNome: string;
  instrutor: string;
  sala: string;
  dataHora: string;
  duracaoMin: number;
  status: 'CONFIRMADO' | 'FILA_ESPERA' | 'CANCELADO';
  criadoEm: string;
}
