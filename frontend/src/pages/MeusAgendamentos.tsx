import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Agendamento } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const MeusAgendamentos: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Estados de feedback de cancelamento (T09 e T10)
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);
  const [cancelErrorMsg, setCancelErrorMsg] = useState<string | null>(null);

  const fetchAgendamentos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/agendamentos/meus');
      setAgendamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, [user]);

  const handleCancelar = async (agendamentoId: string) => {
    setCancellingId(agendamentoId);
    setCancelSuccessMsg(null);
    setCancelErrorMsg(null);

    try {
      const response = await api.delete(`/agendamentos/${agendamentoId}`);
      // T09: Cancelamento realizado com sucesso
      setCancelSuccessMsg(response.data.mensagem);
      fetchAgendamentos();
    } catch (error: any) {
      // T10: Recusa por prazo expirado (< 2h)
      setCancelErrorMsg(error.response?.data?.error || 'Erro ao cancelar agendamento.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatHora = (dataStr: string) => {
    const d = new Date(dataStr);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const confirmados = agendamentos.filter(a => a.status === 'CONFIRMADO');
  const filaEspera = agendamentos.filter(a => a.status === 'FILA_ESPERA');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-move-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-move-primary uppercase tracking-widest bg-move-primary/10 px-2.5 py-0.5 rounded-full border border-move-primary/20">
              RF08 & RF07 · Gestão de Reservas
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-wider text-move-text uppercase">
            Meus Agendamentos
          </h1>
          <p className="text-sm text-move-muted mt-1">
            Exibindo reservas ativas e inscrições em lista de espera de <b className="text-move-text">{user?.nome || 'Aluno'}</b>.
          </p>
        </div>

        <Button onClick={() => navigate('/aulas')}>
          Ver Mais Aulas
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>

      {/* Mensagens de Sucesso e Erro de Cancelamento (T09 e T10) */}
      {cancelSuccessMsg && (
        <div className="p-4 rounded-2xl bg-move-success/15 border border-move-success/40 flex items-start gap-3 text-sm text-move-success shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">T09 · Cancelamento Confirmado</p>
            <p className="mt-0.5">{cancelSuccessMsg}</p>
          </div>
        </div>
      )}

      {cancelErrorMsg && (
        <div className="p-4 rounded-2xl bg-move-danger/15 border border-move-danger/40 flex items-start gap-3 text-sm text-move-danger shadow-lg">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">T10 · Cancelamento Não Permitido</p>
            <p className="mt-0.5">{cancelErrorMsg}</p>
          </div>
        </div>
      )}

      {/* Regra Informativa de Cancelamento */}
      <div className="p-4 rounded-2xl bg-move-surface border border-move-border text-xs text-move-muted flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-move-primary shrink-0" />
        <span>
          <b>Atenção:</b> O cancelamento de vagas é permitido sem penalidade até <b>2 horas</b> antes do início da aula. Cancelamentos tardios configuram falta no histórico do aluno.
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-move-surface border border-move-border animate-pulse" />
          ))}
        </div>
      ) : agendamentos.length === 0 ? (
        <div className="text-center py-16 bg-move-surface border border-move-border rounded-3xl space-y-4">
          <Calendar className="w-12 h-12 text-move-muted mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-move-text">Nenhum agendamento ativo</h3>
            <p className="text-xs text-move-muted mt-1">
              Você ainda não reservou vagas para as aulas de hoje.
            </p>
          </div>
          <Button onClick={() => navigate('/aulas')}>Explorar Grade de Aulas</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Seção de Confirmados */}
          {confirmados.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-wide text-move-text uppercase flex items-center gap-2">
                <span>Vagas Confirmadas</span>
                <span className="text-xs font-sans font-bold bg-move-primary text-move-on-primary px-2 py-0.5 rounded-full">
                  {confirmados.length}
                </span>
              </h2>

              <div className="space-y-3">
                {confirmados.map(item => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-move-surface border border-move-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-move-muted transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-2xl tracking-wide text-move-text uppercase">
                          {item.modalidadeNome}
                        </h3>
                        <Badge variant="success">Confirmado</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-move-muted">
                        <span className="flex items-center gap-1 font-semibold text-move-text">
                          <Clock className="w-3.5 h-3.5 text-move-primary" />
                          <span>Hoje às {formatHora(item.dataHora)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{item.instrutor}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{item.sala}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={cancellingId === item.id}
                        onClick={() => handleCancelar(item.id)}
                      >
                        {cancellingId === item.id ? 'Cancelando...' : 'Cancelar Vaga'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seção de Fila de Espera */}
          {filaEspera.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-wide text-move-text uppercase flex items-center gap-2">
                <span>Inscrições na Fila de Espera</span>
                <span className="text-xs font-sans font-bold bg-yellow-500 text-black px-2 py-0.5 rounded-full">
                  {filaEspera.length}
                </span>
              </h2>

              <div className="space-y-3">
                {filaEspera.map(item => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-move-surface border border-move-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-2xl tracking-wide text-move-text uppercase">
                          {item.modalidadeNome}
                        </h3>
                        <Badge variant="warning">Aguardando Vaga</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-move-muted">
                        <span className="flex items-center gap-1 font-semibold text-move-text">
                          <Clock className="w-3.5 h-3.5 text-move-primary" />
                          <span>Hoje às {formatHora(item.dataHora)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{item.sala}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={cancellingId === item.id}
                        onClick={() => handleCancelar(item.id)}
                      >
                        Sair da Fila
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
