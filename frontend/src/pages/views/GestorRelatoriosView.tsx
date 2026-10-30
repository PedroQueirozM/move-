import React, { useState } from 'react';
import {
  Download,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const GestorRelatoriosView: React.FC = () => {
  const [period, setPeriod] = useState<'HOJE' | 'SEMANA' | 'MES' | 'ANO'>('MES');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExport = (format: 'CSV' | 'PDF') => {
    setExportNotice(`Relatório ${format} gerado e pronto para download.`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  const modalityStats = [
    { name: 'Power Cycle', occupancy: 95, color: 'bg-sky-500', totalClasses: 36, confirmed: 684 },
    { name: 'Funcional 360', occupancy: 88, color: 'bg-orange-500', totalClasses: 42, confirmed: 756 },
    { name: 'HIIT Express', occupancy: 82, color: 'bg-amber-500', totalClasses: 40, confirmed: 656 },
    { name: 'Yoga Flow', occupancy: 71, color: 'bg-purple-500', totalClasses: 28, confirmed: 397 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
            Relatórios e desempenho
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Métricas de assiduidade, ocupação média e taxas de cancelamento
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => handleExport('PDF')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Gerar PDF</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Period Selector Tabs */}
      <div className="bg-white p-1 rounded-xl border border-zinc-200/80 inline-flex items-center gap-1 shadow-sm">
        <button
          onClick={() => setPeriod('HOJE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            period === 'HOJE' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Hoje
        </button>
        <button
          onClick={() => setPeriod('SEMANA')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            period === 'SEMANA' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Esta semana
        </button>
        <button
          onClick={() => setPeriod('MES')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            period === 'MES' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Este mês
        </button>
        <button
          onClick={() => setPeriod('ANO')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            period === 'ANO' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Ano vigente
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-1">
          <p className="text-xs text-zinc-400 font-medium">Ocupação Média</p>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">78.4%</p>
          <p className="text-[11px] font-semibold text-emerald-600 pt-1">+6.2% vs mês anterior</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-1">
          <p className="text-xs text-zinc-400 font-medium">Presença Confirmada</p>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">91.4%</p>
          <p className="text-[11px] font-semibold text-amber-600 pt-1">Meta da unidade: 85%</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-1">
          <p className="text-xs text-zinc-400 font-medium">Faltas Não Justificadas</p>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">4.2%</p>
          <p className="text-[11px] font-semibold text-zinc-500 pt-1">Abaixo do teto tolerado (5%)</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-1">
          <p className="text-xs text-zinc-400 font-medium">Cancelamentos &gt; 2h</p>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-none">88.5%</p>
          <p className="text-[11px] font-semibold text-emerald-600 pt-1">Vagas liberadas para a fila</p>
        </div>
      </div>

      {/* Modality Breakdown + Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Modality Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-zinc-900">
            Ocupação por modalidade
          </h3>

          <div className="space-y-4">
            {modalityStats.map(mod => (
              <div key={mod.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${mod.color}`} />
                    <span className="font-bold text-zinc-800">{mod.name}</span>
                    <span className="text-zinc-400 text-[11px]">({mod.totalClasses} aulas)</span>
                  </div>
                  <span className="font-extrabold text-zinc-900">{mod.occupancy}%</span>
                </div>

                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${mod.color} rounded-full transition-[width] duration-500`}
                    style={{ width: `${mod.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-900 text-white flex flex-col justify-between shadow-sm space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Horários mais disputados
              </h3>
              <Clock className="w-4 h-4 text-brand-primary" />
            </div>
            <p className="text-xs text-zinc-400">
              Concentração de reservas e demanda por vagas
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-400">Faixa Matutina</p>
                <p className="text-sm font-extrabold text-white mt-0.5">06:30 - 08:00</p>
              </div>
              <span className="text-xs font-bold text-brand-primary bg-yellow-500/10 px-2.5 py-1 rounded-lg">
                86% lotação
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-400">Pico Noturno</p>
                <p className="text-sm font-extrabold text-white mt-0.5">18:00 - 20:30</p>
              </div>
              <span className="text-xs font-bold text-brand-primary bg-yellow-500/10 px-2.5 py-1 rounded-lg">
                94% lotação
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
            Recomendação: considerar ampliação de turmas de Power Cycle e Funcional na faixa das 18h30.
          </div>
        </div>
      </div>
    </div>
  );
};
