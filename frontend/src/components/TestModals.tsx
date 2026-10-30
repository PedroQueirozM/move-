import React from 'react';
import { useSimulation, SimBooking } from '../contexts/SimulationContext';
import {
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  X,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const TestModals: React.FC = () => {
  const {
    simUser,
    activeModal,
    setActiveModal,
    selectedClass,
    setClasses,
    setMyBookings,
    selectedBookingToCancel,
    receptionList,
    setReceptionList
  } = useSimulation();

  if (!activeModal) return null;

  const vagas = selectedClass.capacity - selectedClass.occupied;
  const isLotada = vagas <= 0;

  // T02: Ação de reservar ou entrar na fila
  const handleT02Reserve = () => {
    if (isLotada) {
      setActiveModal('T06'); // Entrar na fila
      return;
    }
    setActiveModal('T03'); // Ir para confirmação (clique 2)
  };

  // T03: Ação de confirmar reserva (clique 3)
  const handleT03Confirm = () => {
    // CA2: Se for aluno inadimplente (Bruno), recusa!
    if (simUser === 'bruno') {
      setActiveModal('T05');
      return;
    }

    // CA1 / CA3: Se tiver vaga
    if (vagas > 0) {
      // Consumir 1 vaga
      setClasses(prev =>
        prev.map(c =>
          c.id === selectedClass.id ? { ...c, occupied: c.occupied + 1 } : c
        )
      );

      // Adicionar aos agendamentos de Ana
      const newB: SimBooking = {
        id: `b-${Date.now()}`,
        title: selectedClass.title,
        time: selectedClass.time,
        day: 'Hoje, 22 de maio',
        instructor: selectedClass.instructor,
        room: selectedClass.sala,
        status: 'CONFIRMADO'
      };
      setMyBookings(prev => [newB, ...prev]);

      setActiveModal('T04'); // Sucesso T04
    } else {
      setActiveModal('T06'); // Fila
    }
  };

  // T08: Ação de confirmar cancelamento
  const handleT08ConfirmCancel = () => {
    if (!selectedBookingToCancel) return;

    // Calcular antecedência em relação ao horário simulado 10:00
    // Hidroginástica 15:00 = 5h (aceito)
    // Funcional 12:00 = 2h00 exato (aceito)
    // Alongamento 11:59 = 1h59 (recusado!)
    if (selectedBookingToCancel.time === '11:59') {
      // Menos de 2h!
      setActiveModal('T10');
      return;
    }

    // Antecedência >= 2h: Sucesso!
    // Liberar vaga
    setClasses(prev =>
      prev.map(c =>
        c.title === selectedBookingToCancel.title
          ? { ...c, occupied: Math.max(0, c.occupied - 1) }
          : c
      )
    );

    // Remover dos agendamentos
    setMyBookings(prev =>
      prev.filter(b => b.id !== selectedBookingToCancel.id)
    );

    setActiveModal('T09');
  };

  // T11: Check-in na recepção
  const handleCheckIn = (id: string) => {
    setReceptionList(prev =>
      prev.map(att => (att.id === id ? { ...att, status: 'PRESENTE' } : att))
    );
  };

  // T11: Registrar falta na recepção
  const handleFalta = (id: string) => {
    setReceptionList(prev =>
      prev.map(att => (att.id === id ? { ...att, status: 'FALTA' } : att))
    );
    setActiveModal('T12');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 transition-opacity"
        onClick={() => setActiveModal(null)}
      />

      {/* MODAL CARD */}
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-2xl z-10 text-zinc-900 animate-fadeIn border border-zinc-200/80">
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================
            T02: DETALHES DA AULA
           ======================================================== */}
        {activeModal === 'T02' && (
          <div className="space-y-5">
            <div className="border-b border-zinc-100 pb-3">
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Tela T02 · Detalhes da Aula
              </span>
              <h3 className="text-xl font-extrabold text-zinc-900 mt-2">
                {selectedClass.title}
              </h3>
              <p className="text-xs text-zinc-500">
                Hoje às {selectedClass.time} · {selectedClass.duration} · {selectedClass.sala}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Instrutor Responsável</span>
                <span className="font-bold text-zinc-900">{selectedClass.instructor}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Vagas Disponíveis</span>
                <span className={`font-extrabold text-sm ${vagas === 0 ? 'text-red-600' : vagas === 1 ? 'text-amber-600' : 'text-zinc-900'}`}>
                  {vagas === 0 ? 'Aula lotada' : `${vagas} de ${selectedClass.capacity} vagas`}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Ocupação Atual</span>
                <span className="font-semibold text-zinc-700">{selectedClass.occupied} / {selectedClass.capacity} inscritos</span>
              </div>
            </div>

            <div className="pt-2">
              {vagas > 0 ? (
                <button
                  onClick={handleT02Reserve}
                  className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-zinc-950 font-bold text-xs shadow-md shadow-yellow-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Reservar vaga</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold text-center border border-red-200">
                    Aula lotada ({selectedClass.capacity}/{selectedClass.capacity})
                  </div>
                  <button
                    onClick={() => setActiveModal('T06')}
                    className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Entrar na fila de espera</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            T03: CONFIRMAR RESERVA
           ======================================================== */}
        {activeModal === 'T03' && (
          <div className="space-y-5">
            <div className="border-b border-zinc-100 pb-3">
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Tela T03 · Confirmar Reserva
              </span>
              <h3 className="text-xl font-extrabold text-zinc-900 mt-2">
                Confirmar reserva da vaga
              </h3>
              <p className="text-xs text-zinc-500">
                Revise os dados antes de finalizar o agendamento (Clique 3)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Modalidade:</span>
                <span className="font-bold text-zinc-900">{selectedClass.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Horário:</span>
                <span className="font-bold text-zinc-900">Hoje às {selectedClass.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Aluno identificado:</span>
                <span className="font-bold text-zinc-900">
                  {simUser === 'ana' ? 'Ana Souza (Contrato Ativo)' : 'Bruno Lima (Inadimplente)'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setActiveModal('T02')}
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleT03Confirm}
                className="flex-1 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-zinc-950 font-bold text-xs shadow-md shadow-yellow-500/20 transition-colors"
              >
                Confirmar reserva
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            T04: SUCESSO - VAGA GARANTIDA
           ======================================================== */}
        {activeModal === 'T04' && (
          <div className="text-center space-y-4 py-2">
            <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Tela T04 · Sucesso
            </span>

            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-zinc-900">
                Vaga garantida em {selectedClass.title}, hoje às {selectedClass.time}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Reserva confirmada em 3 cliques. Apresente o QR Code na catraca.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 inline-flex flex-col items-center justify-center mx-auto space-y-2">
              <div className="w-28 h-28 bg-white border border-zinc-300 rounded-xl flex items-center justify-center shadow-inner">
                <QrCode className="w-20 h-20 text-zinc-900" />
              </div>
              <span className="font-mono text-[11px] text-zinc-600 font-bold tracking-widest">
                MOVE-REC-8492
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors"
              >
                Concluir e ver agendamentos
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            T05: RECUSA INADIMPLENTE
           ======================================================== */}
        {activeModal === 'T05' && (
          <div className="text-center space-y-4 py-2">
            <span className="inline-block text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
              Tela T05 · Recusa por Inadimplência
            </span>

            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-zinc-900">
                Reserva não autorizada
              </h3>
              <p className="text-xs font-bold text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                Contrato inadimplente. Não foi possível reservar. Procure a recepção.
              </p>
              <p className="text-[11px] text-zinc-500">
                Aluno: Bruno Lima · Nenhuma vaga foi consumida da aula.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            T06: FILA DE ESPERA
           ======================================================== */}
        {activeModal === 'T06' && (
          <div className="text-center space-y-4 py-2">
            <span className="inline-block text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
              Tela T06 · Fila de Espera
            </span>

            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-zinc-900">
                Você entrou na fila de espera
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Turma lotada de {selectedClass.title} às {selectedClass.time}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
              Posição: 1ª
            </div>

            <p className="text-[11px] text-zinc-500">
              Caso ocorra algum cancelamento até 2h antes da aula, você será notificado imediatamente e a vaga passará para você.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors"
              >
                Ok, acompanhar fila
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            T08: CONFIRMAR CANCELAMENTO
           ======================================================== */}
        {activeModal === 'T08' && selectedBookingToCancel && (
          <div className="space-y-5">
            <div className="border-b border-zinc-100 pb-3">
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Tela T08 · Cancelar Agendamento
              </span>
              <h3 className="text-xl font-extrabold text-zinc-900 mt-2">
                Confirmar cancelamento?
              </h3>
              <p className="text-xs text-zinc-500">
                Aula: {selectedBookingToCancel.title} ({selectedBookingToCancel.time})
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1">
              <p className="font-semibold text-zinc-800">Regra de cancelamento:</p>
              <p>O cancelamento só é aceito com até 2h de antecedência do início da aula.</p>
              <p className="text-zinc-500 text-[11px]">Horário atual da simulação: 10:00</p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleT08ConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
              >
                Confirmar cancelamento
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            T09: CANCELADO COM SUCESSO
           ======================================================== */}
        {activeModal === 'T09' && (
          <div className="text-center space-y-4 py-2">
            <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Tela T09 · Cancelado com Sucesso
            </span>

            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-zinc-900">
                Agendamento cancelado
              </h3>
              <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                A vaga foi liberada e o primeiro da fila será notificado.
              </p>
              <p className="text-[11px] text-zinc-500">
                A aula foi removida da sua lista de agendamentos e a vaga retornou à grade.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            T10: RECUSA POR PRAZO (<2H)
           ======================================================== */}
        {activeModal === 'T10' && (
          <div className="text-center space-y-4 py-2">
            <span className="inline-block text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
              Tela T10 · Recusa de Cancelamento por Prazo
            </span>

            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-sm">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-zinc-900">
                Cancelamento não permitido
              </h3>
              <p className="text-xs font-bold text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                Faltam menos de 2h... O cancelamento só é aceito até 2h antes.
              </p>
              <p className="text-[11px] text-zinc-500">
                Aula às 11:59 (1h59 de antecedência em relação às 10:00). A reserva continua mantida em Meus Agendamentos. Procure a recepção.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            T11: RECEPÇÃO - LISTA DE PRESENÇA
           ======================================================== */}
        {activeModal === 'T11' && (
          <div className="space-y-5">
            <div className="border-b border-zinc-100 pb-3">
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Tela T11 · Visão Recepção / Check-in
              </span>
              <h3 className="text-xl font-extrabold text-zinc-900 mt-2">
                Lista de Presença · Funcional 12:00
              </h3>
              <p className="text-xs text-zinc-500">
                Arena Funcional · Instrutora: Marina Alves
              </p>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {receptionList.map(att => (
                <div
                  key={att.id}
                  className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-zinc-900">{att.name}</p>
                    <p className="text-[11px] text-zinc-400">{att.email}</p>
                    <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      att.status === 'PRESENTE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : att.status === 'FALTA'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-zinc-200 text-zinc-700'
                    }`}>
                      {att.status === 'PRESENTE' ? 'Presente' : att.status === 'FALTA' ? 'Falta' : 'Aguardando'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCheckIn(att.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        att.status === 'PRESENTE'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      Check-in
                    </button>
                    <button
                      onClick={() => handleFalta(att.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        att.status === 'FALTA'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      Falta
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors"
              >
                Concluir recepção
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            T12: FALTA REGISTRADA
           ======================================================== */}
        {activeModal === 'T12' && (
          <div className="text-center space-y-4 py-2">
            <span className="inline-block text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
              Tela T12 · Falta Registrada
            </span>

            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-sm">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-zinc-900">
                Falta registrada no histórico
              </h3>
              <p className="text-xs font-bold text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                Falta de Carlos Pires registrada... salva no histórico de assiduidade.
              </p>
              <p className="text-[11px] text-zinc-500">
                Status na lista da recepção atualizado para "Falta".
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModal('T11')}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors"
              >
                Voltar para lista de presença (T11)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
