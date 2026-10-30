import React, { useState } from 'react';
import {
  Plus,
  BarChart3,
  Search,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';

interface ClassItem {
  id: string;
  time: string;
  dotColor: string;
  title: string;
  instructor: string;
  occupancy: string;
  isHigh: boolean;
}

interface StudentAttendee {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'PRESENTE' | 'FALTA' | 'AGUARDANDO';
}

const initialClasses: ClassItem[] = [
  {
    id: 'c1',
    time: '06:30',
    dotColor: 'bg-amber-500',
    title: 'HIIT Express',
    instructor: 'Caio Nunes',
    occupancy: '12/15',
    isHigh: false
  },
  {
    id: 'c2',
    time: '08:00',
    dotColor: 'bg-purple-500',
    title: 'Yoga Flow',
    instructor: 'Luísa Ramos',
    occupancy: '6/14',
    isHigh: false
  },
  {
    id: 'c3',
    time: '12:15',
    dotColor: 'bg-orange-500',
    title: 'Funcional 360',
    instructor: 'Marina Alves',
    occupancy: '13/18',
    isHigh: false
  },
  {
    id: 'c4',
    time: '18:30',
    dotColor: 'bg-sky-500',
    title: 'Power Cycle',
    instructor: 'Diego Lima',
    occupancy: '18/20',
    isHigh: true
  }
];

const initialAttendees: Record<string, StudentAttendee[]> = {
  c1: [
    { id: 'a1', name: 'Ana Souza', email: 'ana@moveplus.com', plan: 'Move One', status: 'PRESENTE' },
    { id: 'a2', name: 'Carlos Pires', email: 'carlos@moveplus.com', plan: 'Move One', status: 'AGUARDANDO' },
    { id: 'a3', name: 'Mariana Duarte', email: 'mariana@email.com', plan: 'Move Prime', status: 'AGUARDANDO' },
    { id: 'a4', name: 'Felipe Ribeiro', email: 'felipe@email.com', plan: 'Move One', status: 'AGUARDANDO' }
  ],
  c2: [
    { id: 'b1', name: 'Juliana Mendes', email: 'juliana@email.com', plan: 'Move Prime', status: 'PRESENTE' },
    { id: 'b2', name: 'Roberto Castro', email: 'roberto@email.com', plan: 'Move One', status: 'AGUARDANDO' }
  ],
  c3: [
    { id: 'c1', name: 'Ana Souza', email: 'ana@moveplus.com', plan: 'Move One', status: 'PRESENTE' },
    { id: 'c2', name: 'Bruno Lima', email: 'bruno@moveplus.com', plan: 'Move One', status: 'AGUARDANDO' },
    { id: 'c3', name: 'Carla Dias', email: 'carla@email.com', plan: 'Move One', status: 'AGUARDANDO' }
  ],
  c4: [
    { id: 'd1', name: 'Alex Martins', email: 'alex@moveplus.fit', plan: 'Move One', status: 'AGUARDANDO' },
    { id: 'd2', name: 'Fernanda Lima', email: 'fernanda@email.com', plan: 'Move Prime', status: 'PRESENTE' },
    { id: 'd3', name: 'Lucas Andrade', email: 'lucas@email.com', plan: 'Move One', status: 'AGUARDANDO' }
  ]
};

const weeklyOccupancyBars = [
  { day: 'S', heightPct: 62 },
  { day: 'T', heightPct: 78 },
  { day: 'Q', heightPct: 92 },
  { day: 'Q', heightPct: 74 },
  { day: 'S', heightPct: 96 },
  { day: 'S', heightPct: 88 },
  { day: 'D', heightPct: 54 }
];

export const PainelGestorView: React.FC<{
  onNavigateTab?: (tab: string) => void;
}> = ({ onNavigateTab }) => {
  const [classesList, setClassesList] = useState<ClassItem[]>(initialClasses);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [attendeesMap, setAttendeesMap] = useState<Record<string, StudentAttendee[]>>(initialAttendees);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Formulário de nova aula
  const [newTitle, setNewTitle] = useState('Power Cycle');
  const [newInstructor, setNewInstructor] = useState('Diego Lima');
  const [newTime, setNewTime] = useState('19:30');
  const [newCapacity, setNewCapacity] = useState('20');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass: ClassItem = {
      id: `c_${Date.now()}`,
      time: newTime,
      dotColor: 'bg-emerald-500',
      title: newTitle,
      instructor: newInstructor,
      occupancy: `0/${newCapacity}`,
      isHigh: false
    };
    setClassesList([...classesList, newClass]);
    setIsNewClassModalOpen(false);
  };

  const handleUpdateStatus = (classId: string, attendeeId: string, newStatus: 'PRESENTE' | 'FALTA' | 'AGUARDANDO') => {
    setAttendeesMap(prev => {
      const currentList = prev[classId] || [];
      const updated = currentList.map(item => {
        if (item.id === attendeeId) {
          return { ...item, status: newStatus };
        }
        return item;
      });
      return { ...prev, [classId]: updated };
    });
  };

  const recentStudents = [
    {
      id: 'st1',
      name: 'Ana Souza',
      plan: 'Move One',
      date: 'Hoje, 08:15',
      status: 'Ativo',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'st2',
      name: 'Bruno Lima',
      plan: 'Move One',
      date: 'Hoje, 10:40',
      status: 'Inadimplente',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'st3',
      name: 'Carlos Pires',
      plan: 'Move One',
      date: 'Ontem, 18:30',
      status: 'Ativo',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'st4',
      name: 'Juliana Mendes',
      plan: 'Move Prime',
      date: 'Ontem, 16:10',
      status: 'Ativo',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  const filteredStudents = recentStudents.filter(st =>
    st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
            Painel da unidade
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Operação de turmas, frequência em tempo real e capacidade instalada.
          </p>
        </div>

        <button
          onClick={() => setIsNewClassModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova aula</span>
        </button>
      </div>

      {/* Row of 4 Stat Cards with Visual Rhythm */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-1">
          <p className="text-xs text-zinc-400 font-medium">Aulas hoje</p>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">24</p>
          <p className="text-[11px] font-semibold text-amber-600 pt-1">+3 rel. ontem</p>
        </div>

        {/* Stat 2 */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-1">
          <p className="text-xs text-zinc-400 font-medium">Agendamentos</p>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">186</p>
          <p className="text-[11px] font-semibold text-zinc-500 pt-1">91% confirmados</p>
        </div>

        {/* Stat 3 - Destaque de Capacidade */}
        <div className="p-5 rounded-2xl bg-white border-2 border-amber-400/60 shadow-sm space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-amber-400/10 rounded-bl-full pointer-events-none" />
          <p className="text-xs text-zinc-600 font-bold">Ocupação média</p>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">78%</p>
          <p className="text-[11px] font-semibold text-amber-600 pt-1">+6% este mês</p>
        </div>

        {/* Stat 4 */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-1">
          <p className="text-xs text-zinc-400 font-medium">Alunos ativos</p>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">1.248</p>
          <p className="text-[11px] font-semibold text-emerald-600 pt-1">+32 em maio</p>
        </div>
      </div>

      {/* Middle Grid: Aulas e ocupação (Left) + Ocupação semanal (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Aulas e ocupação (~65%) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Aulas e ocupação
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                hoje, 22 de maio
              </p>
            </div>

            <button
              onClick={() => onNavigateTab && onNavigateTab('gestor-alunos')}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors"
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-3">
            {classesList.map(c => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 flex items-center justify-between gap-4 hover:bg-white hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-xs font-bold text-zinc-900 w-12 shrink-0">
                    {c.time}
                  </span>

                  <span className={`w-2.5 h-2.5 rounded-full ${c.dotColor} shrink-0`} />

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 truncate">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {c.instructor}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    c.isHigh
                      ? 'bg-red-50 text-red-600'
                      : 'bg-yellow-500/10 text-yellow-800 border border-yellow-500/20'
                  }`}>
                    {c.occupancy}
                  </span>

                  <button
                    onClick={() => setSelectedClass(c)}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    Gerenciar lista
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ocupação semanal (~35%) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-zinc-900 text-white flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-white">
                Ocupação semanal
              </h3>
              <BarChart3 className="w-4 h-4 text-brand-primary" />
            </div>

            {/* Bar Chart */}
            <div className="h-40 flex items-end justify-between gap-2 px-2 pt-4">
              {weeklyOccupancyBars.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full bg-zinc-800 rounded-t-md h-full flex items-end">
                    <div
                      className="w-full bg-brand-primary rounded-t-md transition-colors duration-300 hover:bg-brand-primary-hover"
                      style={{ height: `${bar.heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-400">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Inset Card: Horário de pico */}
          <div className="mt-6 p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              HORÁRIO DE PICO
            </span>
            <p className="text-base sm:text-lg font-extrabold text-white">
              18:00 - 20:00
            </p>
            <p className="text-xs text-brand-primary font-bold">
              92% de ocupação média
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Alunos recentes */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-900">
              Alunos recentes
            </h3>
            <p className="text-xs text-zinc-400">
              Matrículas e perfis atualizados
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar aluno..."
              className="w-full pl-3 pr-8 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStudents.map(st => (
            <div
              key={st.id}
              className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-800 font-bold flex items-center justify-center text-xs shrink-0">
                  {st.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-zinc-900 truncate">
                    {st.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {st.plan} · {st.date}
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.statusColor}`}>
                {st.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Gerenciar Lista de Presença */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setSelectedClass(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  {selectedClass.title} - {selectedClass.time}
                </h3>
                <p className="text-xs text-zinc-500">
                  Lista de presença · Instrutor: {selectedClass.instructor} · Ocupação: {selectedClass.occupancy}
                </p>
              </div>

              <button
                onClick={() => setSelectedClass(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Attendees list */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {((attendeesMap[selectedClass.id] || attendeesMap['c1']) || []).map(att => (
                <div
                  key={att.id}
                  className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {att.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {att.email} · {att.plan}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleUpdateStatus(selectedClass.id, att.id, 'PRESENTE')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        att.status === 'PRESENTE'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Check-in</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedClass.id, att.id, 'FALTA')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        att.status === 'FALTA'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Falta</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedClass(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-colors"
              >
                Concluir gestão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nova Aula */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setIsNewClassModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-xl z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Adicionar Nova Aula
                </h3>
                <p className="text-xs text-zinc-500">
                  Cadastrar horário na grade operacional
                </p>
              </div>

              <button
                onClick={() => setIsNewClassModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Modalidade
                </label>
                <select
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  <option value="HIIT Express">HIIT Express</option>
                  <option value="Yoga Flow">Yoga Flow</option>
                  <option value="Funcional 360">Funcional 360</option>
                  <option value="Power Cycle">Power Cycle</option>
                  <option value="Força & Hipertrofia">Força & Hipertrofia</option>
                  <option value="Pilates Solo">Pilates Solo</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Instrutor Responsável
                </label>
                <input
                  type="text"
                  required
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  placeholder="Nome do instrutor"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Horário de Início
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Capacidade de Alunos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-zinc-950 text-xs font-bold shadow-md shadow-yellow-500/20 transition-colors"
                >
                  Criar aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
