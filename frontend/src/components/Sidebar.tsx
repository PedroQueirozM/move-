import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Activity,
  ClipboardList,
  User,
  Users,
  BarChart3,
  ArrowRight,
  ChevronDown,
  Dumbbell
} from 'lucide-react';

export type TabType =
  | 'visao-geral'
  | 'minha-agenda'
  | 'modalidades'
  | 'ficha-treino'
  | 'meu-perfil'
  | 'painel-gestor'
  | 'gestor-alunos'
  | 'gestor-relatorios';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenLoginModal: () => void;
  role: 'ALUNO' | 'GESTOR';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenLoginModal,
  role
}) => {
  const alunoMenuItems = [
    { id: 'visao-geral' as TabType, label: 'Visão geral', icon: LayoutDashboard },
    { id: 'minha-agenda' as TabType, label: 'Minha agenda', icon: Calendar },
    { id: 'modalidades' as TabType, label: 'Modalidades', icon: Activity },
    { id: 'ficha-treino' as TabType, label: 'Ficha de treino', icon: ClipboardList },
    { id: 'meu-perfil' as TabType, label: 'Meu perfil', icon: User },
  ];

  const gestorMenuItems = [
    { id: 'painel-gestor' as TabType, label: 'Painel gestor', icon: LayoutDashboard },
    { id: 'gestor-alunos' as TabType, label: 'Alunos', icon: Users },
    { id: 'gestor-relatorios' as TabType, label: 'Relatórios', icon: BarChart3 },
  ];

  const currentMenuItems = role === 'GESTOR' ? gestorMenuItems : alunoMenuItems;

  return (
    <aside className="w-64 bg-sidebar text-white flex flex-col justify-between shrink-0 min-h-screen p-5 border-r border-zinc-800/60">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="w-9 h-9 rounded-xl bg-brand-primary text-zinc-950 flex items-center justify-center font-bold shadow-md shadow-yellow-500/20">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">
              MOVE+
            </h1>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold block mt-0.5">
              TRAINING CLUB
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 block">
            {role === 'GESTOR' ? 'ADMINISTRAÇÃO' : 'SEU ESPAÇO'}
          </span>

          <nav className="space-y-1">
            {currentMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors duration-150 ${
                    isActive
                      ? 'bg-brand-primary text-zinc-950 font-bold shadow-sm shadow-yellow-500/20'
                      : 'text-zinc-400 font-semibold hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User Card */}
      <div className="pt-4 border-t border-zinc-800/60">
        <button
          onClick={onOpenLoginModal}
          title="Clique para alternar perfil ou efetuar login"
          className="w-full p-2.5 rounded-2xl bg-sidebar-card hover:bg-zinc-800/80 border border-zinc-800 flex items-center justify-between text-left transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#FDBA74] text-zinc-900 font-bold flex items-center justify-center text-xs shrink-0">
              AM
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate group-hover:text-brand-primary transition-colors">
                {role === 'GESTOR' ? 'Ana Martins' : 'Alex Martins'}
              </p>
              <p className="text-[10px] text-zinc-400 truncate">
                {role === 'GESTOR' ? 'Gestora da unidade' : 'Plano Move One'}
              </p>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 shrink-0" />
        </button>
      </div>
    </aside>
  );
};
