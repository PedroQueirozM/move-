import React, { useState } from 'react';
import { Check } from 'lucide-react';

export const MeuPerfilView: React.FC = () => {
  const [nome, setNome] = useState('Alex Martins');
  const [email, setEmail] = useState('alex@moveplus.fit');
  const [telefone, setTelefone] = useState('(11) 98765-4321');
  const [objetivo, setObjetivo] = useState('Hipertrofia e condicionamento');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold tracking-tight text-zinc-900">
          Perfil e preferências cadastrais
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Atualize seus dados de contato e objetivos de treinamento
        </p>
      </div>

      {/* Main Grid: Left Profile Card & Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Dark Card (4 cols) */}
        <div className="lg:col-span-4 p-8 rounded-2xl bg-zinc-900 text-white border border-zinc-800 shadow-md flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#FDBA74] text-zinc-900 font-extrabold flex items-center justify-center text-2xl shadow-md">
            AM
          </div>

          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white">{nome}</h4>
            <p className="text-xs text-zinc-400">Membro desde janeiro de 2026</p>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800">
            <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
              <span className="font-display text-3xl font-extrabold text-white block leading-none">68</span>
              <p className="text-[11px] text-zinc-400 mt-1">Treinos</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
              <span className="font-display text-3xl font-extrabold text-amber-400 block leading-none">12</span>
              <p className="text-[11px] text-zinc-400 mt-1">Sequência</p>
            </div>
          </div>
        </div>

        {/* Right Form Card (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <h4 className="text-base font-bold text-zinc-900">
              Informações pessoais
            </h4>
            {saved && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>Salvo com sucesso</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Telefone
                </label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Objetivo principal
                </label>
                <input
                  type="text"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Salvar alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
