import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Dumbbell, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

const LoginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  senha: z.string().min(1, 'A senha é obrigatória')
});

type LoginFormData = z.infer<typeof LoginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: 'ana@moveplus.com',
      senha: 'senha123'
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      await login(data.email, data.senha);
      navigate('/aulas');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Falha ao autenticar. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-move-primary text-move-on-primary shadow-lg shadow-move-primary/20 mb-2">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl tracking-wider text-move-text uppercase">
            Acessar o <span className="text-move-primary">MOVE+</span>
          </h1>
          <p className="text-sm text-move-muted">
            Informe suas credenciais para gerenciar suas aulas e agendamentos.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-move-surface border border-move-border rounded-2xl p-6 sm:p-8 shadow-xl">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-move-danger/10 border border-move-danger/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-move-danger shrink-0 mt-0.5" />
              <p className="text-sm text-move-danger font-medium">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu.email@exemplo.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              error={errors.senha?.message}
              {...register('senha')}
            />

            <Button type="submit" fullWidth disabled={isSubmitting} size="lg" className="mt-2">
              {isSubmitting ? 'Entrando...' : 'Entrar no Sistema'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Atalhos para preenchimento rápido de teste */}
          <div className="mt-6 pt-6 border-t border-move-border">
            <p className="text-xs text-move-muted font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-move-primary" />
              <span>Contas de teste para simulação:</span>
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'ana@moveplus.com');
                  setValue('senha', 'senha123');
                }}
                className="p-2 rounded-lg bg-move-surface-card border border-move-border hover:border-move-primary text-left transition-colors"
              >
                <b className="text-move-text block">Ana Souza</b>
                <span className="text-move-success font-medium">Contrato Ativo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setValue('email', 'bruno@moveplus.com');
                  setValue('senha', 'senha123');
                }}
                className="p-2 rounded-lg bg-move-surface-card border border-move-border hover:border-move-primary text-left transition-colors"
              >
                <b className="text-move-text block">Bruno Lima</b>
                <span className="text-move-danger font-medium">Inadimplente</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-move-muted">
          Ainda não tem conta no Move+?{' '}
          <Link to="/cadastro" className="text-move-primary font-bold hover:underline">
            Cadastre-se agora
          </Link>
        </p>
      </div>
    </div>
  );
};
