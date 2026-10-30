import React from 'react';
import {
  Dumbbell,
  Activity,
  Sparkles,
  Flame,
  Filter,
  ArrowRight
} from 'lucide-react';
import { TabType } from '../../components/Sidebar';

interface ModalidadesViewProps {
  onNavigateTab: (tab: TabType) => void;
}

export const ModalidadesView: React.FC<ModalidadesViewProps> = ({ onNavigateTab }) => {
  const modalidades = [
    {
      id: 'm1',
      title: 'Força & Hipertrofia',
      description: 'Treinos estruturados para ganho de força e evolução consistente.',
      classesCount: '12 turmas',
      icon: Dumbbell,
      iconBg: 'bg-amber-400',
      iconColor: 'text-zinc-950'
    },
    {
      id: 'm2',
      title: 'Funcional 360',
      description: 'Mobilidade, potência e condicionamento em um treino dinâmico.',
      classesCount: '18 turmas',
      icon: Activity,
      iconBg: 'bg-orange-500',
      iconColor: 'text-white'
    },
    {
      id: 'm3',
      title: 'Yoga Flow',
      description: 'Respiração e movimento para mais equilíbrio dentro e fora da academia.',
      classesCount: '8 turmas',
      icon: Sparkles,
      iconBg: 'bg-purple-500',
      iconColor: 'text-white'
    },
    {
      id: 'm4',
      title: 'Power Cycle',
      description: 'Alta intensidade, música e energia para superar seus limites.',
      classesCount: '16 turmas',
      icon: Flame,
      iconBg: 'bg-cyan-500',
      iconColor: 'text-white'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header with Filter Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-zinc-900">
            Modalidades e Treinos Coletivos
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Descubra as práticas integradas ao seu plano de treino
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200/90 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          <span>Filtrar</span>
        </button>
      </div>

      {/* Grid of 4 Modality Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modalidades.map(m => {
          const Icon = m.icon;

          return (
            <div
              key={m.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-sm hover:border-zinc-300 transition-colors flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl ${m.iconBg} ${m.iconColor} flex items-center justify-center shadow-md shadow-zinc-200`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-400">
                    {m.classesCount}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <button
                  onClick={() => onNavigateTab('minha-agenda')}
                  className="text-xs font-semibold text-zinc-900 group-hover:text-amber-600 flex items-center gap-1.5 transition-colors"
                >
                  <span>Ver horários</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Dark Banner: Plano Move One */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md border border-zinc-800">
        <div className="space-y-1">
          <h4 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            Todas as modalidades. Um só plano Move One.
          </h4>
          <p className="text-xs text-zinc-400">
            Acesso irrestrito a musculação, aulas coletivas e avaliações periódicas sem custos extras.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('minha-agenda')}
          className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-zinc-950 text-xs font-bold shadow-md shadow-yellow-500/20 transition-colors shrink-0"
        >
          Realizar matrícula
        </button>
      </div>
    </div>
  );
};
