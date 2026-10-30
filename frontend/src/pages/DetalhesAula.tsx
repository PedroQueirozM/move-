import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Aula } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import {
  Clock,
  MapPin,
  User,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  CalendarCheck
} from 'lucide-react';

export const DetalhesAula: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [aula, setAula] = useState<Aula | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Estados de resposta do agendamento (T04, T05, T06)
  const [successData, setSuccessData] = useState<{
    mensagem: string;
    qrCodeToken?: string;
    posicao?: number;
    tipo: 'CONFIRMADO' | 'FILA_ESPERA';
  } | null>(null);

  const [inadimplenteError, setInadimplenteError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const fetchAula = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/aulas/${id}`);
      setAula(response.data);
    } catch (error) {
      console.error('Erro ao buscar aula:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAula();
  }, [id]);

  const handleAgendar = async (entrarNaFila: boolean = false) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setInadimplenteError(null);
    setGeneralError(null);

    try {
      const response = await api.post('/agendamentos', {
        aulaId: id,
        entrarNaFila
      });

      setSuccessData(response.data);
      // Atualizar dados da aula
      fetchAula();
    } catch (error: any) {
      if (error.response?.data?.code === 'INADIMPLENTE') {
        // T05 - Recusa por inadimplência
        setInadimplenteError(error.response.data.error);
      } else {
        setGeneralError(error.response?.data?.error || 'Erro ao processar reserva.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-move-primary border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm text-move-muted">Carregando detalhes da aula...</p>
      </div>
    );
  }

  if (!aula) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-move-text">Aula não encontrada</h2>
        <Button variant="secondary" onClick={() => navigate('/aulas')}>
          Voltar para a Grade
        </Button>
      </div>
    );
  }

  const horaFormatada = new Date(aula.dataHora).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // T04 ou T06 - Tela de Sucesso ou Fila de Espera
  if (successData) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 space-y-6">
        <div className="bg-move-surface border border-move-border rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          {successData.tipo === 'CONFIRMADO' ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-move-primary/20 border border-move-primary/40 text-move-primary flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-move-primary" />
              </div>

              <div>
                <span className="text-xs font-bold text-move-primary uppercase tracking-widest bg-move-primary/10 px-2.5 py-0.5 rounded-full border border-move-primary/20">
                  T04 · Reserva Confirmada
                </span>
                <h1 className="font-display text-3xl sm:text-4xl text-move-text tracking-wide mt-2 uppercase">
                  Vaga Garantida!
                </h1>
                <p className="text-sm text-move-muted mt-2">
                  {successData.mensagem}
                </p>
              </div>

              {/* QR Code Simulado para Catraca */}
              <div className="p-6 bg-move-surface-card border border-move-border rounded-2xl space-y-3">
                <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-xl flex items-center justify-center shadow-lg">
                  {/* Grid de simulação de QR Code */}
                  <div className="w-full h-full bg-[conic-gradient(#111_25%,#fff_0_50%,#111_0_75%,#fff_0)] [background-size:16px_16px] rounded" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-move-primary tracking-widest">
                    {successData.qrCodeToken}
                  </p>
                  <p className="text-[11px] text-move-muted mt-0.5">
                    Apresente este código diretamente no leitor da catraca
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button fullWidth onClick={() => navigate('/meus-agendamentos')}>
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  Ver Meus Agendamentos
                </Button>
                <Button variant="secondary" fullWidth onClick={() => navigate('/aulas')}>
                  Voltar para a Grade de Aulas
                </Button>
              </div>
            </>
          ) : (
            // T06 - Fila de Espera Confirmada
            <>
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10 text-yellow-400" />
              </div>

              <div>
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest bg-yellow-500/10 px-2.5 py-0.5 rounded-full border border-yellow-500/20">
                  T06 · Fila de Espera
                </span>
                <h1 className="font-display text-3xl sm:text-4xl text-move-text tracking-wide mt-2 uppercase">
                  Inscrição na Fila
                </h1>
                <p className="text-sm text-move-muted mt-2">
                  {successData.mensagem}
                </p>
              </div>

              <div className="p-4 bg-move-surface-card border border-move-border rounded-2xl">
                <p className="text-xs text-move-muted uppercase tracking-wider font-semibold">
                  Sua posição atual na fila:
                </p>
                <p className="font-display text-5xl text-move-primary my-1">
                  {successData.posicao}ª
                </p>
                <p className="text-xs text-move-muted">
                  Assim que um aluno cancelar, a primeira pessoa da fila assume a vaga automaticamente.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Button fullWidth onClick={() => navigate('/meus-agendamentos')}>
                  Ver Meus Agendamentos
                </Button>
                <Button variant="secondary" fullWidth onClick={() => navigate('/aulas')}>
                  Voltar às Aulas
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // T05 - Recusa por Inadimplência
  if (inadimplenteError) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 space-y-6">
        <div className="bg-move-surface border border-move-danger/40 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-move-danger/20 border border-move-danger/40 text-move-danger flex items-center justify-center mx-auto">
            <ShieldAlert className="w-10 h-10 text-move-danger" />
          </div>

          <div>
            <span className="text-xs font-bold text-move-danger uppercase tracking-widest bg-move-danger/10 px-2.5 py-0.5 rounded-full border border-move-danger/20">
              T05 · Reserva Não Realizada
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-move-text tracking-wide mt-2 uppercase">
              Contrato Inadimplente
            </h1>
            <p className="text-sm text-move-muted mt-2">
              {inadimplenteError}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-move-surface-card border border-move-border text-xs text-move-muted text-left space-y-1.5">
            <p className="font-bold text-move-text">O que fazer agora?</p>
            <p>1. Procure a recepção da sua unidade para regularizar as mensalidades em aberto.</p>
            <p>2. Após a quitação no sistema, o agendamento de todas as aulas será liberado na hora.</p>
          </div>

          <div className="space-y-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setInadimplenteError(null);
                navigate('/aulas');
              }}
            >
              Voltar para a Grade de Aulas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isEnrolled = aula.usuarioStatus === 'CONFIRMADO';
  const isFila = aula.usuarioStatus === 'FILA_ESPERA';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate('/aulas')}
        className="inline-flex items-center gap-2 text-sm text-move-muted hover:text-move-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para a Grade de Horários</span>
      </button>

      {/* Main Card */}
      <div className="bg-move-surface border border-move-border rounded-3xl overflow-hidden shadow-xl">
        {/* Banner com Imagem */}
        <div className="relative h-56 sm:h-64 bg-move-surface-card overflow-hidden">
          {aula.modalidade.imagem && (
            <img
              src={aula.modalidade.imagem}
              alt={aula.modalidade.nome}
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-move-surface via-move-surface/50 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-move-primary uppercase tracking-widest bg-move-primary/20 backdrop-blur-md px-3 py-1 rounded-full border border-move-primary/30">
                RF06 · Detalhes da Aula
              </span>
              <h1 className="font-display text-4xl sm:text-5xl text-move-text tracking-wide mt-2 uppercase">
                {aula.modalidade.nome}
              </h1>
            </div>

            <div>
              {isEnrolled ? (
                <Badge variant="success" className="text-sm px-3 py-1">Inscrito nesta aula</Badge>
              ) : isFila ? (
                <Badge variant="warning" className="text-sm px-3 py-1">Na Fila de Espera</Badge>
              ) : aula.isLotada ? (
                <Badge variant="danger" className="text-sm px-3 py-1">Aula Lotada</Badge>
              ) : (
                <Badge variant="primary" className="text-sm px-3 py-1">{aula.vagasRestantes} vagas restantes</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {generalError && (
            <div className="p-4 rounded-xl bg-move-danger/10 border border-move-danger/30 text-sm text-move-danger font-medium">
              {generalError}
            </div>
          )}

          {/* Grid de Especificações */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-move-surface-card border border-move-border">
            <div>
              <span className="text-[11px] text-move-muted font-semibold uppercase tracking-wider block">Horário</span>
              <p className="text-base font-bold text-move-text mt-0.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-move-primary" />
                <span>{horaFormatada}</span>
              </p>
            </div>

            <div>
              <span className="text-[11px] text-move-muted font-semibold uppercase tracking-wider block">Duração</span>
              <p className="text-base font-bold text-move-text mt-0.5">
                {aula.duracaoMin} minutos
              </p>
            </div>

            <div>
              <span className="text-[11px] text-move-muted font-semibold uppercase tracking-wider block">Instrutor</span>
              <p className="text-base font-bold text-move-text mt-0.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-move-primary" />
                <span className="truncate">{aula.instrutor}</span>
              </p>
            </div>

            <div>
              <span className="text-[11px] text-move-muted font-semibold uppercase tracking-wider block">Local</span>
              <p className="text-base font-bold text-move-text mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-move-primary" />
                <span>{aula.sala}</span>
              </p>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <h3 className="text-xs font-semibold text-move-muted uppercase tracking-wider mb-2">
              Sobre a Modalidade
            </h3>
            <p className="text-sm text-move-text/90 leading-relaxed">
              {aula.modalidade.descricao || 'Treinamento focado em condicionamento, saúde e performance esportiva com acompanhamento do time de especialistas Move+.'}
            </p>
            <p className="text-xs text-move-muted mt-2">
              * Você vê apenas a quantidade de vagas restantes, preservando a privacidade dos outros participantes.
            </p>
          </div>

          {/* Seção de Ação */}
          <div className="pt-6 border-t border-move-border space-y-4">
            {isEnrolled ? (
              <div className="p-4 rounded-2xl bg-move-success/10 border border-move-success/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-move-success shrink-0" />
                  <p className="text-sm text-move-success font-medium">
                    Você já possui vaga garantida para esta aula.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/meus-agendamentos')}>
                  Gerenciar Reserva
                </Button>
              </div>
            ) : isFila ? (
              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
                  <p className="text-sm text-yellow-400 font-medium">
                    Você está inscrito na lista de espera desta turma.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/meus-agendamentos')}>
                  Ver Minha Posição
                </Button>
              </div>
            ) : aula.isLotada ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-move-danger/10 border border-move-danger/30 text-sm text-move-danger">
                  <b>Turma 100% Lotada:</b> Entre na fila de espera para ser avisado e alocado imediatamente se uma vaga abrir.
                </div>
                <Button
                  fullWidth
                  size="lg"
                  disabled={submitting}
                  onClick={() => handleAgendar(true)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black"
                >
                  {submitting ? 'Inscrevendo...' : 'Entrar na Fila de Espera'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-move-muted">
                  <span>Aluno: <b className="text-move-text">{user?.nome || 'Convidado'}</b></span>
                  <span>Vagas livres: <b className="text-move-primary">{aula.vagasRestantes} de {aula.capacidade}</b></span>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  disabled={submitting}
                  onClick={() => handleAgendar(false)}
                >
                  {submitting ? 'Confirmando Reserva...' : 'Confirmar Reserva de Vaga'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
