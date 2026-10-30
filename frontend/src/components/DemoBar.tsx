import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ShieldAlert, Sparkles, Calendar, User } from 'lucide-react';

export const DemoBar: React.FC = () => {
  const { user, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  return (
    <aside aria-label="Painel de simulação rápida" className="bg-move-surface border-b border-move-border text-xs py-2 px-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-display text-base tracking-wider text-move-primary">MOVE+</span>
          <span className="text-move-border">|</span>
          <span className="text-move-muted">Ambiente de Demonstração (Hora simulada: <b className="text-move-text">10:00</b>)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-move-muted hidden sm:inline">Perfil Ativo:</span>
          
          <button
            onClick={() => switchDemoUser('ana@moveplus.com')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              user?.email === 'ana@moveplus.com'
                ? 'bg-move-primary text-move-on-primary font-bold border-move-primary'
                : 'bg-move-surface-card text-move-muted border-move-border hover:text-move-text'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Ana (Ativo)</span>
          </button>

          <button
            onClick={() => switchDemoUser('bruno@moveplus.com')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              user?.email === 'bruno@moveplus.com'
                ? 'bg-move-primary text-move-on-primary font-bold border-move-primary'
                : 'bg-move-surface-card text-move-muted border-move-border hover:text-move-text'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Bruno (Inadimplente)</span>
          </button>

          <button
            onClick={() => switchDemoUser('admin@moveplus.com')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              user?.papel === 'ADMIN'
                ? 'bg-move-primary text-move-on-primary font-bold border-move-primary'
                : 'bg-move-surface-card text-move-muted border-move-border hover:text-move-text'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <div className="h-4 w-px bg-move-border mx-1 hidden sm:block" />

          <button
            onClick={() => navigate('/aulas')}
            className="flex items-center gap-1 text-move-muted hover:text-move-primary transition-colors px-2 py-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Grade de Aulas</span>
          </button>

          <button
            onClick={() => navigate('/meus-agendamentos')}
            className="flex items-center gap-1 text-move-muted hover:text-move-primary transition-colors px-2 py-1"
          >
            <User className="w-3.5 h-3.5" />
            <span>Meus Agendamentos</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
