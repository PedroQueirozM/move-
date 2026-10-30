import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SimulationProvider } from './contexts/SimulationContext';
import { TestRunnerBar } from './components/TestRunnerBar';
import { TestModals } from './components/TestModals';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';

// Telas do Espaço Aluno
import { VisaoGeralView } from './pages/views/VisaoGeralView';
import { MinhaAgendaView } from './pages/views/MinhaAgendaView';
import { ModalidadesView } from './pages/views/ModalidadesView';
import { FichaTreinoView } from './pages/views/FichaTreinoView';
import { MeuPerfilView } from './pages/views/MeuPerfilView';

// Telas do Espaço Gestor (Conforme solicitado com base no protótipo)
import { PainelGestorView } from './pages/views/PainelGestorView';
import { GestorAlunosView } from './pages/views/GestorAlunosView';
import { GestorRelatoriosView } from './pages/views/GestorRelatoriosView';

export const App: React.FC = () => {
  const [role, setRole] = useState<'ALUNO' | 'GESTOR'>('GESTOR');
  const [activeTab, setActiveTab] = useState<TabType>('painel-gestor');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const handleRoleChange = (newRole: 'ALUNO' | 'GESTOR') => {
    setRole(newRole);
    if (newRole === 'GESTOR') {
      setActiveTab('painel-gestor');
    } else {
      setActiveTab('visao-geral');
    }
  };

  const handleNavigateFromSim = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'painel-gestor' || tab === 'gestor-alunos' || tab === 'gestor-relatorios') {
      setRole('GESTOR');
    } else {
      setRole('ALUNO');
    }
  };

  return (
    <AuthProvider>
      <SimulationProvider onNavigateTab={handleNavigateFromSim}>
        <div className="min-h-screen flex flex-col bg-canvas text-zinc-900 font-sans antialiased selection:bg-brand-primary selection:text-zinc-950">
          {/* Barra superior de testes (T01 a T12 conforme especificação visual) */}
          <TestRunnerBar />

          <div className="flex-1 flex min-w-0">
            {/* Sidebar com suporte dinâmico a Aluno e Gestor */}
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              role={role}
            />

            {/* Área Principal de Conteúdo */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
              {/* Header Superior */}
              <Header
                activeTab={activeTab}
                onOpenLoginModal={() => setIsLoginModalOpen(true)}
                role={role}
              />

              {/* Conteúdo Dinâmico */}
              <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
                {/* Telas do Gestor */}
                {role === 'GESTOR' && activeTab === 'painel-gestor' && (
                  <PainelGestorView onNavigateTab={(tab) => setActiveTab(tab as TabType)} />
                )}

                {role === 'GESTOR' && activeTab === 'gestor-alunos' && (
                  <GestorAlunosView />
                )}

                {role === 'GESTOR' && activeTab === 'gestor-relatorios' && (
                  <GestorRelatoriosView />
                )}

                {/* Telas do Aluno */}
                {role === 'ALUNO' && activeTab === 'visao-geral' && (
                  <VisaoGeralView onNavigateTab={(tab) => setActiveTab(tab as TabType)} />
                )}

                {role === 'ALUNO' && activeTab === 'minha-agenda' && (
                  <MinhaAgendaView />
                )}

                {role === 'ALUNO' && activeTab === 'modalidades' && (
                  <ModalidadesView onNavigateTab={(tab) => setActiveTab(tab as TabType)} />
                )}

                {role === 'ALUNO' && activeTab === 'ficha-treino' && (
                  <FichaTreinoView />
                )}

                {role === 'ALUNO' && activeTab === 'meu-perfil' && (
                  <MeuPerfilView />
                )}
              </main>
            </div>
          </div>

          {/* Modal / Popup de Login (contém o switch de Aluno e Gestor) */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            role={role}
            onRoleChange={handleRoleChange}
          />

          {/* Modais de Teste (T02 a T12) */}
          <TestModals />
        </div>
      </SimulationProvider>
    </AuthProvider>
  );
};

export default App;
