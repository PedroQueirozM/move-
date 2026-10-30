import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Dumbbell, Calendar, UserCheck, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Badge } from './Badge';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-move-surface/80 backdrop-blur-md border-b border-move-border sticky top-9 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/aulas" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-move-primary text-move-on-primary flex items-center justify-center font-bold shadow-md shadow-move-primary/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-2xl tracking-wider text-move-text leading-none block">
              MOVE<span className="text-move-primary">+</span>
            </span>
            <span className="text-[10px] text-move-muted tracking-widest uppercase font-semibold block">
              ALTA PERFORMANCE
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/aulas"
            className="flex items-center gap-2 text-move-text hover:text-move-primary transition-colors"
          >
            <Calendar className="w-4 h-4 text-move-primary" />
            <span>Aulas & Vagas</span>
          </Link>

          {user && (
            <Link
              to="/meus-agendamentos"
              className="flex items-center gap-2 text-move-muted hover:text-move-text transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>Meus Agendamentos</span>
            </Link>
          )}
        </nav>

        {/* User Status / Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-move-text leading-tight">{user.nome}</p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <Badge
                    variant={
                      user.matriculaStatus === 'INADIMPLENTE'
                        ? 'danger'
                        : user.matriculaStatus === 'ATIVA'
                        ? 'success'
                        : 'muted'
                    }
                  >
                    {user.matriculaStatus === 'INADIMPLENTE'
                      ? 'Inadimplente'
                      : user.matriculaStatus === 'ATIVA'
                      ? 'Contrato Ativo'
                      : 'Sem Matrícula'}
                  </Badge>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 rounded-xl border border-move-border hover:border-move-danger hover:text-move-danger text-move-muted transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-move-text border border-move-border hover:border-move-primary transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </Link>
              <Link
                to="/cadastro"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-move-primary text-move-on-primary hover:bg-move-primary-hover transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Cadastrar</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
