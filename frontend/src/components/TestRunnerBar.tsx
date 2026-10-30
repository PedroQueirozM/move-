import React, { useState } from 'react';
import { useSimulation } from '../contexts/SimulationContext';
import { RotateCcw, User, UserX, Clock, ChevronUp, ChevronDown } from 'lucide-react';

export const TestRunnerBar: React.FC = () => {
  const {
    simUser,
    setSimUser,
    simTime,
    resetSimulation,
    navigateToScreen,
    activeModal
  } = useSimulation();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('move_plus_test_bar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('move_plus_test_bar_collapsed', String(next));
      return next;
    });
  };

  const screens = [
    { id: 'T01', label: 'T01 Aulas' },
    { id: 'T02', label: 'T02 Detalhe' },
    { id: 'T03', label: 'T03 Confirmar' },
    { id: 'T04', label: 'T04 Confirmada' },
    { id: 'T05', label: 'T05 Recusa inadimpl.' },
    { id: 'T06', label: 'T06 Fila' },
    { id: 'T07', label: 'T07 Meus agend.' },
    { id: 'T08', label: 'T08 Cancelar' },
    { id: 'T09', label: 'T09 Cancelado' },
    { id: 'T10', label: 'T10 Recusa prazo' },
    { id: 'T11', label: 'T11 Recepção' },
    { id: 'T12', label: 'T12 Falta' }
  ];

  if (isCollapsed) {
    return (
      <button
        onClick={toggleCollapse}
        title="Mostrar cabeçalho de testes (T01 a T12)"
        className="fixed top-0 right-8 z-50 flex items-center gap-1.5 px-3 py-1 rounded-b-lg bg-[#111113] text-zinc-300 hover:text-white border-x border-b border-zinc-700 shadow-md text-[11px] font-semibold transition-all hover:bg-zinc-800 group"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
        <span className="group-hover:text-white transition-colors">Testes (T01-T12)</span>
        <ChevronDown className="w-3.5 h-3.5 text-brand-primary transition-transform group-hover:translate-y-0.5" />
      </button>
    );
  }

  return (
    <div className="bg-[#111113] text-white border-b border-zinc-800 px-4 py-2 text-xs sticky top-0 z-40 shadow-sm transition-all duration-200">
      <div className="w-full flex flex-col gap-2">
        {/* Linha 1: Botões de navegação rápida T01 a T12 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          <span className="text-zinc-400 font-semibold mr-1 text-[11px] shrink-0">Ir para:</span>

          <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
            {screens.map(s => {
              const isActive = activeModal === s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => navigateToScreen(s.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors duration-150 shrink-0 ${
                    isActive
                      ? 'bg-brand-primary text-zinc-950 font-bold shadow-sm shadow-yellow-500/20'
                      : 'bg-white text-zinc-900 hover:bg-zinc-200'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Linha 2: Ferramentas da simulação e setinha na ponta direita */}
        <div className="flex items-center justify-between gap-3 border-t border-zinc-800/80 pt-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Relógio simulado */}
            <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-brand-primary" />
              <span className="text-zinc-400 text-[11px]">Simulação:</span>
              <span className="font-bold text-white text-[11px]">{simTime}</span>
            </div>

            {/* Alternador de aluno (Ana x Bruno) */}
            <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                onClick={() => setSimUser('ana')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  simUser === 'ana'
                    ? 'bg-brand-primary text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <User className="w-3 h-3" />
                <span>Ana (Ativo)</span>
              </button>

              <button
                onClick={() => setSimUser('bruno')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  simUser === 'bruno'
                    ? 'bg-amber-400 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <UserX className="w-3 h-3" />
                <span>Bruno (Inadimpl.)</span>
              </button>
            </div>

            {/* Reiniciar dados */}
            <button
              onClick={resetSimulation}
              title="Reiniciar dados da simulação antes de cada caso de teste"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold transition-colors border border-zinc-700"
            >
              <RotateCcw className="w-3 h-3 text-brand-primary" />
              <span>Reiniciar dados</span>
            </button>
          </div>

          {/* Setinha na extremidade direita para esconder o cabeçalho */}
          <button
            onClick={toggleCollapse}
            title="Esconder cabeçalho de testes"
            aria-label="Esconder cabeçalho de testes"
            className="flex items-center gap-1.5 px-2.5 py-1 