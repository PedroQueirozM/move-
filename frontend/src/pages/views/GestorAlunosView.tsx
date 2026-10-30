import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mail,
  ChevronRight,
  X
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: 'ATIVO' | 'INADIMPLENTE' | 'AVALIACAO_PENDENTE';
  weeklyFrequency: string;
  lastPresence: string;
  goal: string;
}

const mockStudents: Student[] = [
  {
    id: 'st-1',
    name: 'Ana Souza',
    email: 'ana@moveplus.com',
    phone: '(11) 98765-4321',
    plan: 'Move One',
    status: 'ATIVO',
    weeklyFrequency: '4x / semana',
    lastPresence: 'Hoje, 08:15',
    goal: 'Hipertrofia e condicionamento'
  },
  {
    id: 'st-2',
    name: 'Bruno Lima',
    email: 'bruno@moveplus.com',
    phone: '(11) 97777-8888',
    plan: 'Move One',
    status: 'INADIMPLENTE',
    weeklyFrequency: '1x / semana',
    lastPresence: 'Há 3 dias',
    goal: 'Perda de peso e resistência'
  },
  {
    id: 'st-3',
    name: 'Carlos Pires',
    email: 'carlos@moveplus.com',
    phone: '(11) 96666-5555',
    plan: 'Move One',
    status: 'ATIVO',
    weeklyFrequency: '3x / semana',
    lastPresence: 'Ontem, 18:30',
    goal: 'Ganho de mobilidade'
  },
  {
    id: 'st-4',
    name: 'Juliana Mendes',
    email: 'juliana@email.com',
    phone: '(11) 95555-4444',
    plan: 'Move Prime',
    status: 'ATIVO',
    weeklyFrequency: '5x / semana',
    lastPresence: 'Hoje, 12:20',
    goal: 'Definição muscular'
  },
  {
    id: 'st-5',
    name: 'Roberto Castro',
    email: 'roberto@email.com',
    phone: '(11) 94444-3333',
    plan: 'Move One',
    status: 'AVALIACAO_PENDENTE',
    weeklyFrequency: '2x / semana',
    lastPresence: 'Há 5 dias',
    goal: 'Reabilitação postural'
  },
  {
    id: 'st-6',
    name: 'Mariana Duarte',
    email: 'mariana@email.com',
    phone: '(11) 93333-2222',
    plan: 'Move Prime',
    status: 'ATIVO',
    weeklyFrequency: '4x / semana',
    lastPresence: 'Ontem, 19:40',
    goal: 'Condicionamento geral'
  }
];

export const GestorAlunosView: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ATIVO' | 'INADIMPLENTE' | 'AVALIACAO_PENDENTE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);

  const filteredStudents = students.filter(st => {
    const matchesFilter = filterStatus === 'ALL' || st.status === filterStatus;
    const matchesSearch =
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.plan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRegularize = (id: string) => {
    setStudents(prev =>
      prev.map(st => (st.id === id ? { ...st, status: 'ATIVO' } : st))
    );
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent({ ...selectedStudent, status: 'ATIVO' });
    }
  };

  const handleSendNotification = () => {
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
            Alunos da unidade
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Quadro de matrículas ativas, regularizações e planos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 px-3.5 py-2 rounded-xl shadow-sm">
            Total: 1.248 alunos cadastrados
          </span>
        </div>
      </div>

      {/* KPI Stats with Barlow Condensed numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Alunos Ativos</p>
            <p className="font-display text-3xl font-extrabold text-zinc-900 leading-none mt-1">1.206</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Inadimplentes</p>
            <p className="font-display text-3xl font-extrabold text-amber-600 leading-none mt-1">42</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Avaliações Pendentes</p>
            <p className="font-display text-3xl font-extrabold text-zinc-900 leading-none mt-1">18</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Controls: Filter Pills + Search */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === 'ALL'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
              }`}
            >
              Todos ({mockStudents.length})
            </button>

            <button
              onClick={() => setFilterStatus('ATIVO')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === 'ATIVO'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
              }`}
            >
              Ativos
            </button>

            <button
              onClick={() => setFilterStatus('INADIMPLENTE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === 'INADIMPLENTE'
                  ? 'bg-amber-600 text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
              }`}
            >
              Inadimplentes
            </button>

            <button
              onClick={() => setFilterStatus('AVALIACAO_PENDENTE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterStatus === 'AVALIACAO_PENDENTE'
                  ? 'bg-brand-primary text-zinc-950 shadow-sm shadow-yellow-500/20'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
              }`}
            >
              Avaliação pendente
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, e-mail..."
              className="w-full pl-3 pr-8 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:bg-white transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Table of Students */}
        <div className="divide-y divide-zinc-100">
          {filteredStudents.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              Nenhum aluno encontrado para os filtros selecionados.
            </div>
          ) : (
            filteredStudents.map(st => (
              <div
                key={st.id}
                onClick={() => setSelectedStudent(st)}
                className="py-3 px-2 rounded-xl hover:bg-zinc-50 flex items-center justify-between gap-4 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-800 font-bold flex items-center justify-center text-xs shrink-0">
                    {st.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 truncate">
                      {st.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {st.email} · {st.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-semibold text-zinc-800 block">
                      {st.plan}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Freq: {st.weeklyFrequency}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      st.status === 'ATIVO'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : st.status === 'INADIMPLENTE'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {st.status === 'ATIVO'
                      ? 'Ativo'
                      : st.status === 'INADIMPLENTE'
                      ? 'Inadimplente'
                      : 'Avaliação'}
                  </span>

                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Detalhes do Aluno */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setSelectedStudent(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-xl z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-800 font-bold flex items-center justify-center text-xs">
                  {selectedStudent.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Matrícula: {selectedStudent.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-400">Situação Cadastral</span>
                <span className="font-bold text-zinc-900">{selectedStudent.status}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-400">Plano Atual</span>
                <span className="font-bold text-zinc-900">{selectedStudent.plan}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-400">Objetivo Declarado</span>
                <span className="font-medium text-zinc-800">{selectedStudent.goal}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-400">Frequência Semanal</span>
                <span className="font-medium text-zinc-800">{selectedStudent.weeklyFrequency}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-400">Última Presença</span>
                <span className="font-medium text-zinc-800">{selectedStudent.lastPresence}</span>
              </div>
            </div>

            {notificationSent && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Notificação enviada com sucesso para o aluno!</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-2">
              {selectedStudent.status === 'INADIMPLENTE' && (
                <button
                  onClick={() => handleRegularize(selectedStudent.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                >
                  Regularizar contrato
                </button>
              )}

              <button
                onClick={handleSendNotification}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors ml-auto"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Notificar aluno</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
