import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Aula, Modalidade } from '../types';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Clock, MapPin, User, Users, Sparkles, AlertCircle } from 'lucide-react';

export const GradeAulas: React.FC = () => {
  const navigate = useNavigate();
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [selectedMod, setSelectedMod] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAulas, resMods] = await Promise.all([
        api.get('/aulas'),
        api.get('/modalidades')
      ]);
      setAulas(resAulas.data);
      setModalidades(resMods.data);
    } catch (error) {
      console.error('Erro ao carregar grade de aulas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAulas = selectedMod === 'ALL'
    ? aulas
    : aulas.filter(a => a.modalidade.id === selectedMod);

  const formatHora = (dataStr: string) => {
    const d = new Date(dataStr);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-move-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-move-primary uppercase tracking-widest bg-move-primary/10 px-2.5 py-0.5 rounded-full border border-move-primary/20">
              RF09 · Grade de Horários
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-wider text-move-text uppercase">
            Aulas de Hoje & Horários
          </h1>
          <p className="text-sm text-move-muted mt-1">
            Consulte turmas disponíveis, instrutores e garanta sua vaga em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={fetchData}>
            Atualizar Vagas
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedMod('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            selectedMod === 'ALL'
              ? 'bg-move-primary text-move-on-primary shadow-md shadow-move-primary/10'
              : 'bg-move-surface text-move-muted border border-move-border hover:border-move-primary hover:text-move-text'
          }`}
        >
          Todas as Modalidades ({aulas.length})
        </button>

        {modalidades.map(mod => (
          <button
            key={mod.id}
            onClick={() => setSelectedMod(mod.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedMod === mod.id
                ? 'bg-move-primary text-move-on-primary shadow-md shadow-move-primary/10'
                : 'bg-move-surface text-move-muted border border-move-border hover:border-move-primary hover:text-move-text'
            }`}
          >
            {mod.nome}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-move-surface border border-move-border animate-pulse" />
          ))}
        </div>
      ) : filteredAulas.length === 0 ? (
        <div className="text-center py-16 bg-move-surface border border-move-border rounded-2xl">
          <AlertCircle className="w-10 h-10 text-move-muted mx-auto mb-3" />
          <p className="text-move-text font-bold">Nenhuma aula encontrada para esta categoria.</p>
          <p className="text-xs text-move-muted mt-1">Experimente selecionar outra modalidade acima.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAulas.map(aula => {
            const hora = formatHora(aula.dataHora);
            const isEnrolled = aula.usuarioStatus === 'CONFIRMADO';
            const isFila = aula.usuarioStatus === 'FILA_ESPERA';

            return (
              <div
                key={aula.id}
                onClick={() => navigate(`/aulas/${aula.id}`)}
                className="group cursor-pointer bg-move-surface border border-move-border hover:border-move-primary rounded-2xl overflow-hidden transition-colors duration-200 hover:shadow-xl hover:shadow-move-primary/5 flex flex-col justify-between"
              >
                {/* Image Banner */}
                <div className="relative h-36 bg-move-surface-card overflow-hidden">
                  {aula.modalidade.imagem ? (
                    <img
                      src={aula.modalidade.imagem}
                      alt={aula.modalidade.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-70 group-hover:opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full bg-move-surface-card flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-move-muted" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-move-surface via-move-surface/40 to-transparent" />

                  {/* Badge de Horário */}
                  <div className="absolute top-3 left-3 bg-move-bg/90 backdrop-blur-md px-3 py-1 rounded-xl border border-move-border flex items-center gap-1.5 text-xs font-bold text-move-text">
                    <Clock className="w-3.5 h-3.5 text-move-primary" />
                    <span>{hora}</span>
                    <span className="text-move-muted font-normal">({aula.duracaoMin} min)</span>
                  </div>

                  {/* Badge de Vagas */}
                  <div className="absolute top-3 right-3">
                    {isEnrolled ? (
                      <Badge variant="success">Inscrito</Badge>
                    ) : isFila ? (
                      <Badge variant="warning">Na Fila</Badge>
                    ) : aula.isLotada ? (
                      <Badge variant="danger">Lotada</Badge>
                    ) : (
                      <Badge variant="primary">{aula.vagasRestantes} vagas</Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl tracking-wide text-move-text group-hover:text-move-primary transition-colors uppercase">
                      {aula.modalidade.nome}
                    </h3>
                    <p className="text-xs text-move-muted line-clamp-2 mt-1">
                      {aula.modalidade.descricao || 'Treinamento de alta intensidade com acompanhamento técnico.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-move-border space-y-2 text-xs text-move-muted">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-move-primary" />
                        <span>{aula.instrutor}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-move-muted" />
                        <span>{aula.sala}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>Ocupação: {aula.confirmados} / {aula.capacidade}</span>
                      </span>

                      <span className="font-bold text-move-primary group-hover:underline">
                        Ver detalhes →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
