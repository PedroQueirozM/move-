import React from 'react';
import {
  Flame,
  Activity,
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { TabType } from '../../components/Sidebar';

interface VisaoGeralViewProps {
  onNavigateTab: (tab: TabType) => void;
}

export const VisaoGeralView: React.FC<VisaoGeralViewProps> = ({ onNavigateTab }) => {
  return (
    <div className="space-y-6">
      {/* Hero Banner Dark */}
      <div className="relative rounded-2xl bg-zinc-900 text-white overflow-hidden p-8 sm:p-10 shadow-lg border border-zinc-800">
        {/* Imagem de Fundo Academia */}
        <div className="absolute inset-0 right-0 w-full sm:w-1/2 ml-auto">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80"
            alt="Gym Background"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent" />
        </div>

        {/* Conteúdo do Hero */}
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/90 border border-zinc-700/60 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
            Semana em Movimento
          </span>

          <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
            Consistência hoje.<br />
            <span className="text-brand-primary">Resultado amanhã.</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Você completou 3 de 4 treinos na semana. Falta pouco para bater sua melhor sequência.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('minha-agenda')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-zinc-950 text-xs font-bold shadow-md shadow-yellow-500/20 transition-transform hover:scale-[1.02]"
            >
              <span>Agendar próxima aula</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sequência (Destaque) */}
        <div className="p-5 rounded-2xl bg-white border-2 border-amber-400/60 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
              +2 esta semana
            </span>
          </div>
          <div>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">12 dias</p>
            <p className="text-xs text-zinc-500 mt-1">Sequência atual</p>
          </div>
        </div>

        {/* Card 2: Treinos no mês */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
              Meta: 18
            </span>
          </div>
          <div>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">14</p>
            <p className="text-xs text-zinc-400 mt-1">Treinos no mês</p>
          </div>
        </div>

        {/* Card 3: Tempo em treino */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
              +15% vs. abril
            </span>
          </div>
          <div>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">11h 40</p>
            <p className="text-xs text-zinc-400 mt-1">Tempo em treino</p>
          </div>
        </div>

        {/* Card 4: Progresso geral */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
              Ótimo ritmo
            </span>
          </div>
          <div>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">82%</p>
            <p className="text-xs text-zinc-400 mt-1">Progresso geral</p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Próximos Agendamentos & Ficha de Hoje */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Esquerdo: Próximos Agendamentos */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900">
              Próximos agendamentos
            </h3>
            <button
              onClick={() => onNavigateTab('minha-agenda')}
              className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1"
            >
              <span>Ver agenda</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {/* Item 1 */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-10 bg-orange-500 rounded-full shrink-0" />
                <div>
                  <p className="text-xs font-bold text-zinc-900">Funcional 360</p>
                  <p className="text-[11px] text-zinc-500">Hoje · 12:15 · Sala 1 (Marina Alves)</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                Confirmado
              </span>
            </div>

            {/* Item 2 */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-10 bg-cyan-500 rounded-full shrink-0" />
                <div>
                  <p className="text-xs font-bold text-zinc-900">Power Cycle</p>
                  <p className="text-[11px] text-zinc-500">Quinta-feira · 18:30 · Sala 2 (Diego Lima)</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                Confirmado
              </span>
            </div>
          </div>
        </div>

        {/* Card Direito: Plano de Treino de Hoje (Treino A) */}
        <div className="p-6 rounded-2xl bg-zinc-900 text-white border border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-400">
                Treino de Hoje
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-primary text-zinc-950 text-[10px] font-extrabold tracking-wider shadow-sm shadow-yellow-500/20">
                TREINO A
              </span>
            </div>

            <p className="text-xs text-zinc-400">Plano de treino</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">
              Superiores + Core
            </h3>
            <p className="text-xs text-zinc-300 mt-1">
              Foco em controle de movimento e progressão de carga.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Circular Mini Progress */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-zinc-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-brand-primary"
                    strokeDasharray="71, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold text-white">71%</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white">5 de 7 exercícios</p>
                <p className="text-[11px] text-zinc-400">Restam 2 exercícios hoje</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('ficha-treino')}
              className="text-xs font-bold text-brand-primary hover:text-yellow-300 flex items-center gap-1 transition-colors"
            >
              <span>Ver ficha</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
