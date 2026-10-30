import React, { useState } from 'react';

export const FichaTreinoView: React.FC = () => {
  const [activeWorkout, setActiveWorkout] = useState<'A' | 'B' | 'C'>('A');

  const workouts = [
    {
      id: 'A' as const,
      name: 'Treino A - Superiores',
      meta: '7 exercícios · hoje'
    },
    {
      id: 'B' as const,
      name: 'Treino B - Inferiores',
      meta: '6 exercícios'
    },
    {
      id: 'C' as const,
      name: 'Treino C - Full body',
      meta: '6 exercícios'
    }
  ];

  const exercises = {
    A: [
      { num: 1, name: 'Supino inclinado com halteres', series: '4 séries', reps: '10 repetições', load: '18 kg' },
      { num: 2, name: 'Remada curvada', series: '4 séries', reps: '10 repetições', load: '30 kg' },
      { num: 3, name: 'Desenvolvimento militar', series: '3 séries', reps: '12 repetições', load: '14 kg' },
      { num: 4, name: 'Elevação lateral', series: '3 séries', reps: '15 repetições', load: '8 kg' },
      { num: 5, name: 'Prancha frontal', series: '3 séries', reps: '45 segundos', load: '—' },
    ],
    B: [
      { num: 1, name: 'Agachamento livre', series: '4 séries', reps: '8 repetições', load: '40 kg' },
      { num: 2, name: 'Leg Press 45°', series: '4 séries', reps: '10 repetições', load: '120 kg' },
      { num: 3, name: 'Cadeira extensora', series: '3 séries', reps: '12 repetições', load: '45 kg' },
      { num: 4, name: 'Mesa flexora', series: '3 séries', reps: '12 repetições', load: '35 kg' },
      { num: 5, name: 'Panturrilha em pé', series: '4 séries', reps: '15 repetições', load: '50 kg' },
    ],
    C: [
      { num: 1, name: 'Levantamento terra', series: '4 séries', reps: '6 repetições', load: '60 kg' },
      { num: 2, name: 'Barra fixa assistida', series: '3 séries', reps: '8 repetições', load: 'Peso corpo' },
      { num: 3, name: 'Afundo com halteres', series: '3 séries', reps: '10 repetições', load: '14 kg' },
      { num: 4, name: 'Flexão de braço no solo', series: '3 séries', reps: '12 repetições', load: '—' },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-zinc-900">
            Ficha de treino personalizada
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Prescrição técnica montada pelo treinador Rafael Costa
          </p>
        </div>

        <span className="text-[10px] font-bold text-amber-800 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
          ATUALIZADA HOJE
        </span>
      </div>

      {/* Main Grid: Left Tabs / Right Exercise Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Workouts Tabs (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {workouts.map(w => {
            const isActive = activeWorkout === w.id;

            return (
              <button
                key={w.id}
                onClick={() => setActiveWorkout(w.id)}
                className={`w-full p-4 rounded-2xl text-left transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-md'
                    : 'bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/80'
                }`}
              >
                <h4 className="text-xs font-bold">{w.name}</h4>
                <p className={`text-[11px] mt-0.5 ${isActive ? 'text-zinc-400' : 'text-zinc-400'}`}>
                  {w.meta}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right: Exercises Table Card (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-6">
          {/* Card Top Title & Badge */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <h4 className="text-lg font-extrabold text-zinc-900">
                {activeWorkout === 'A' ? 'Superiores + Core' : activeWorkout === 'B' ? 'Membros Inferiores' : 'Treino Integrado Full Body'}
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Foco em controle de movimento e progressão de carga.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-800 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full tracking-wider">
                TREINO {activeWorkout}
              </span>
            </div>
          </div>

          {/* Exercises List */}
          <div className="space-y-3">
            {exercises[activeWorkout].map(ex => (
              <div
                key={ex.num}
                className="p-3.5 rounded-2xl bg-zinc-50/70 border border-zinc-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-zinc-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                    {ex.num}
                  </span>
                  <span className="font-bold text-zinc-900">
                    {ex.name}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-[11px] text-zinc-500 pl-9 sm:pl-0">
                  <span className="w-16">{ex.series}</span>
                  <span className="w-24">{ex.reps}</span>
                  <span className="font-bold text-zinc-900 w-14 text-right">{ex.load}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
