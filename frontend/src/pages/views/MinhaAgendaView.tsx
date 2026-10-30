import React, { useState } from 'react';
import { useSimulation, SimClass, SimBooking } from '../../contexts/SimulationContext';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X
} from 'lucide-react';

export const MinhaAgendaView: React.FC = () => {
  const {
    simUser,
    classes,
    myBookings,
    setSelectedClass,
    setActiveModal,
    setSelectedBookingToCancel
  } = useSimulation();

  const [selectedDay, setSelectedDay] = useState<number>(22); // QUA 22

  const days = [
    { label: 'SEG', num: 20 },
    { label: 'TER', num: 21 },
    { label: 'QUA', num: 22 },
    { label: 'QUI', num: 23 },
    { label: 'SEX', num: 24 },
    { label: 'SÁB', num: 25 },
    { label: 'DOM', num: 26 },
  ];

  const handleOpenDetail = (c: SimClass) => {
    setSelectedClass(c);
    setActiveModal('T02'); // Clique 1: abre T02 Detalhes
  };

  const handleOpenCancel = (b: SimBooking) => {
    setSelectedBookingToCancel(b);
    setActiveModal('T08'); // Abre T08 Confirmar Cancelamento
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Informação de Contexto da Simulação */}
      <div className="p-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-900">Simulação RF01:</span>
          <span>Aluno logado: <b>{simUser === 'ana' ? 'Ana Souza (Ativo)' : 'Bruno Lima (Inadimplente)'}</b></span>
        </div>
        <span className="text-zinc-500 text-[11px]">Relógio de simulação: 10:00</span>
      </div>

      {/* Main Section: Horários e vagas (T01) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-6">
        {/* Section Header with Date Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-900">
              Horários e vagas (T01)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Grade de aulas coletivas com ocupação em tempo real
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-zinc-800">20 – 26 de maio</span>
            <button className="p-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekly Day Selector */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const isSelected = selectedDay === d.num;

            return (
              <button
                key={d.num}
                onClick={() => setSelectedDay(d.num)}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-colors duration-150 ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-md'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200/60'
                }`}
              >
                <span className={`text-[10px] font-bold tracking-wider ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                  {d.label}
                </span>
                <span className={`text-base font-extrabold mt-0.5 ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                  {d.num}
                </span>
              </button>
            );
          })}
        </div>

        {/* Classes List */}
        <div className="space-y-3 pt-2">
          {classes.map((c) => {
            const vagas = c.capacity - c.occupied;
            const pct = Math.round((c.occupied / c.capacity) * 100);

            return (
              <div
                key={c.id}
                onClick={() => handleOpenDetail(c)}
                className="p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white hover:border-zinc-300 transition-colors cursor-pointer group"
              >
                {/* Left: Time and Title */}
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-display text-lg font-extrabold text-zinc-900 w-12 shrink-0">
                    {c.time}
                  </span>

                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-1.5 h-10 rounded-full ${c.color} shrink-0`} />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 truncate group-hover:text-amber-600 transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        {c.instructor} · {c.duration} · {c.sala}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Progress bar & Action button */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Occupancy bar */}
                  <div className="w-36 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-400 font-medium">Ocupação</span>
                      <span className={`font-bold ${vagas === 0 ? 'text-red-600' : 'text-zinc-800'}`}>
                        {vagas === 0 ? 'Lotada' : `${vagas} vagas`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${vagas === 0 ? 'bg-red-500' : 'bg-zinc-900'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetail(c);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors active:scale-95 ${
                      vagas <= 0
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-black'
                        : 'bg-brand-primary hover:bg-brand-primary-hover text-zinc-950 shadow-md shadow-yellow-500/20'
                    }`}
                  >
                    {vagas <= 0 ? 'Lotada (Fila)' : 'Reservar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Meus agendamentos (T07) */}
      <div id="secao-meus-agendamentos" className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-900">
              Meus agendamentos (T07)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Exibindo apenas as reservas de {simUser === 'ana' ? 'Ana Souza' : 'Bruno Lima'} (Privacidade CA6)
            </p>
          </div>

          <button
            onClick={() => handleOpenDetail(classes[0])}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-zinc-950 text-xs font-bold shadow-md shadow-yellow-500/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo agendamento</span>
          </button>
        </div>

        {myBookings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-zinc-200/80 text-center text-xs text-zinc-400">
            Nenhum agendamento ativo para os próximos dias.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBookings.map(b => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 uppercase tracking-wider">
                      CONFIRMADO
                    </span>
                    <h4 className="text-base font-bold text-zinc-900 mt-2">
                      {b.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {b.day} às {b.time} · {b.room}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Instrutor: {b.instructor}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenCancel(b)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Cancelar este agendamento"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 text-[11px]">
                    Cancelamento até 2h antes
                  </span>
                  <button
                    onClick={() => handleOpenCancel(b)}
                    className="text-red-600 hover:text-red-700 font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
