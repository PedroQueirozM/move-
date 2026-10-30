import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, User, Shield, ArrowRight, Dumbbell } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'ALUNO' | 'GESTOR';
  onRoleChange: (role: 'ALUNO' | 'GESTOR') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  role,
  onRoleChange
}) => {
  const { login } = useAuth();
  const [profileType, setProfileType] = useState<'ALUNO' | 'GESTOR'>(role);
  const [email, setEmail] = useState(role === 'GESTOR' ? 'admin@moveplus.com' : 'alex@moveplus.fit');
  const [senha, setSenha] = useState(role === 'GESTOR' ? 'admin123' : 'senha123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setProfileType(role);
    if (role === 'GESTOR') {
      setEmail('admin@moveplus.com');
      setSenha('admin123');
    } else {
      setEmail('alex@moveplus.fit');
      setSenha('senha123');
    }
  }, [role, isOpen]);

  if (!isOpen) return null;

  const handleProfileSwitch = (type: 'ALUNO' | 'GESTOR') => {
    setProfileType(type);
    setErrorMsg(null);
    if (type === 'ALUNO') {
      setEmail('alex@moveplus.fit');
      setSenha('senha123');
    } else {
      setEmail('admin@moveplus.com');
      setSenha('admin123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await login(email, senha);
      onRoleChange(profileType);
      onClose();
    } catch (err: any) {
      // Fallback para navegação local na simulação
      onRoleChange(profileType);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-xl z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header com Logo */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand-primary text-zinc-950 font-bold shadow-md shadow-yellow-500/20 mb-1">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Acessar o Move+
          </h2>
          <p className="text-xs text-zinc-500">
            Selecione seu perfil de acesso e entre com suas credenciais.
          </p>
        </div>

        {/* SWITCH DE ALUNO E GESTOR (Integrado ao popup de login) */}
        <div className="bg-zinc-100 p-1 rounded-xl flex items-center mb-6 border border-zinc-200/60">
          <button
            type="button"
            onClick={() => handleProfileSwitch('ALUNO')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-150 ${
              profileType === 'ALUNO'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Aluno</span>
          </button>

          <button
            type="button"
            onClick={() => handleProfileSwitch('GESTOR')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-150 ${
              profileType === 'GESTOR'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Gestor</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              {profileType === 'ALUNO' ? 'E-mail do Aluno' : 'E-mail Corporativo do Gestor'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@moveplus.fit"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-zinc-950 text-sm font-bold shadow-md shadow-yellow-500/20 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Entrando...' : `Entrar como ${profileType === 'ALUNO' ? 'Aluno' : 'Gestor'}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Contas rápidas para teste */}
        <div className="mt-6 pt-5 border-t border-zinc-100 space-y-2">
          <p className="text-[11px] font-semibold text-zinc-500">
            Preenchimento rápido de demonstração:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setProfileType('ALUNO');
                setEmail('alex@moveplus.fit');
                setSenha('senha123');
                onRoleChange('ALUNO');
                onClose();
              }}
              className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-colors"
            >
              <b className="block text-zinc-900">Alex Martins</b>
              <span className="text-[11px] text-zinc-500">Aluno · Plano One</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setProfileType('GESTOR');
                setEmail('admin@moveplus.com');
                setSenha('admin123');
                onRoleChange('GESTOR');
                onClose();
              }}
              className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-colors"
            >
              <b className="block text-zinc-900">Ana Martins</b>
              <span className="text-[11px] text-zinc-500">Gestora da Unidade</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
