import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Dumbbell, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const CadastroSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Informe um e-mail válido'),
  senha: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
  telefone: z.string().optional(),
  objetivo: z.string().optional()
});

type CadastroFormData = z.infer<typeof CadastroSchema>;

export const Cadastro: React.FC = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CadastroFormData>({
    resolver: zodResolver(CadastroSchema)
  });

  const onSubmit = async (data: CadastroFormData) => {
    setErrorMsg(null);
    try {
      await registerUser(data);
      navigate('/aulas');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Erro ao realizar cadastro. Tente outro e-mail.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-move-primary text-move-on-primary shadow-lg shadow-move-primary/20 mb-2">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl tracking-wider text-move-text uppercase">
            Crie sua conta no <span className="text-move-primary">MOVE+</span>
          </h1>
          <p className="text-sm text-move-muted">
            Preencha seus dados para começar a agendar aulas e avaliações físicas.
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
              label="Nome Completo *"
              type="text"
              placeholder="Ex: Mariana Silva"
              error={errors.nome?.message}
              {...register('nome')}
            />

            <Input
              label="E-mail *"
              type="email"
              placeholder="mariana@exemplo.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Senha de Acesso *"
              type="password"
              placeholder="Mínimo 6 caracteres"
              error={errors.senha?.message}
              {...register('senha')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Telefone / WhatsApp"
                type="tel"
                placeholder="(11) 99999-9999"
                error={errors.telefone?.message}
                {...register('telefone')}
              />

              <Input
                label="Objetivo Principal"
                type="text"
                placeholder="Ex: Hipertrofia, Resistência"
                error={errors.objetivo?.message}
                {...register('objetivo')}
              />
            </div>

            <div className="p-3 rounded-xl bg-move-surface-card border border-move-border flex items-center gap-2.5 text-xs text-move-muted">
              <CheckCircle2 className="w-4 h-4 text-move-success shrink-0" />
              <span>Sua matrícula inicial será gerada automaticamente com status ativo.</span>
            </div>

            <Button type="submit" fullWidth disabled={isSubmitting} size="lg" className="mt-4">
              {isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-move-muted">
          Já possui conta?{' '}
          <Link to="/login" className="text-move-primary font-bold hover:underline">
            Faça login aqui
          </Link>
        </p>
      </div>
    </div>
  );
};
