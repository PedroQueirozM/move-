import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { TabType } from './Sidebar';

interface HeaderProps {
  activeTab: TabType;
  onOpenLoginModal: () => void;
  role: 'ALUNO' | 'GESTOR';
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onOpenLoginModal, role }) => {
  const titles: Record<TabType, string> = {
    'painel-gestor': 'Visão geral',
    'gestor-alunos': 'Alunos da unidade',
    'gestor-relatorios': 'Relatórios',
    'visao-geral': 'Olá, Alex',
    'minha-agenda': 'Minha agenda',
    'modalidades': 'Modalidades',
    'ficha-treino': 'Ficha de treino',
    'meu-perfil': 'Meu perfil'
  };

  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-zinc-200/60 bg-transparent">
      {/* Breadcrumb & Title */}
      <div>
        <p className="text-xs font-semibold text-zinc-400">
          Move+ Training Club
        </p>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 mt-0.5">
          {titles[activeTab] || 'Visão geral'}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Indicator Pill */}
        <button
          onClick={onOpenLoginModal}
          title="Clique para alternar perfil no login"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200/80 text-[11px] font-semibold text-zinc-700 shadow-sm hover:border-zinc-300 transition-colors"
        >
          <span className={`w-2 h-2 rounded-full ${role === 'GESTOR' ? 'bg-amber-500' : 'bg-brand-primary'}`} />
          <span>{role === 'GESTOR' ? 'Modo Gestor' : 'Modo Aluno'}</span>
        </button>

        {/* Search Input */}
        <div className="relative hidden sm:flex items-center">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar"
            className="pl-8 pr-10 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-primary shadow-sm w-48"
          />
          <span className="absolute right-2.5 text-[10px] text-zinc-400 bg-zinc-100 border border-zinc-200/80 px-1.5 py-0.5 rounded font-mono">
            ⌘ K
          </span>
        </div>

        {/* Notifications */}
        <button
          onClick={onOpenLoginModal}
          className="relative p-2 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-colors shadow-sm"
          title="Notificações"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-primary rounded-full" />
        </button>

        {/* Profile Button */}
        <button
          onClick={onOpenLoginModal}
          className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:border-zinc-300 transition-colors shadow-sm"
          title="Abrir popup de login e alternar Aluno / Gestor"
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center text-xs font-bold">
            <User className="w-4 h-4" />
          </div>
        </button>
      </div>
    </header>
  );
};
