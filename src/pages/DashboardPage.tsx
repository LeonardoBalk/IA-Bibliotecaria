import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { useUser } from '../context/UserContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import AIChat from '../components/AIChat';
import SubscriptionWidget from '../components/SubscriptionWidget';
import UpgradeModal from '../components/UpgradeModal';
import { UserRole } from '../types';

export default function DashboardPage() {
  const { user } = useUser();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgrade = (role: UserRole) => {
    console.log('Upgrade to:', role);
    // Implementar integração com payment service
    setShowUpgradeModal(false);
  };

  // Mock recommendations
  const recommendations = [
    {
      title: 'Introdução à Autopercepção',
      type: 'video',
      level: 'Básico',
      reason: 'Recomendado para iniciar sua jornada',
    },
    {
      title: 'Exercício: Mapeamento Emocional',
      type: 'exercise',
      level: 'Intermediário',
      reason: 'Próximo passo baseado no seu progresso',
    },
    {
      title: 'Neurociência da Transformação',
      type: 'article',
      level: 'Avançado',
      reason: 'Aprofunde seu conhecimento',
    },
  ];

  const recentContent = [
    { title: 'Fundamentos da Neurocom', progress: 100, type: 'video' },
    { title: 'Primeiro Exercício', progress: 60, type: 'exercise' },
  ];

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
            Bem-vindo, {user?.name}
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Continue sua jornada de evolução contínua
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* IA Guardiã Recommendations */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neuro-green/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                    IA Guardiã da Jornada
                  </h2>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Recomendações personalizadas para você
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-neuro bg-light-bg dark:bg-dark-bg hover:shadow-neuro transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-neuro bg-neuro-blue/10 flex items-center justify-center flex-shrink-0">
                      {rec.type === 'video' && (
                        <svg className="w-6 h-6 text-neuro-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      )}
                      {rec.type === 'exercise' && (
                        <svg className="w-6 h-6 text-neuro-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      )}
                      {rec.type === 'article' && (
                        <svg className="w-6 h-6 text-neuro-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-light-text dark:text-dark-text">
                          {rec.title}
                        </h3>
                        <Badge variant="primary">{rec.level}</Badge>
                      </div>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {rec.reason}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Content */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                Continuar Assistindo
              </h2>
              <div className="space-y-3">
                {recentContent.map((content, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-neuro bg-light-bg dark:bg-dark-bg">
                    <div className="flex-1">
                      <h3 className="font-medium text-light-text dark:text-dark-text mb-2">
                        {content.title}
                      </h3>
                      <div className="w-full h-2 bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-neuro-green transition-all"
                          style={{ width: `${content.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {content.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* IA Conversacional */}
            <AIChat type="conversational" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SubscriptionWidget 
              userRole={user?.role || 'free'}
              onUpgrade={() => setShowUpgradeModal(true)}
            />

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                Acesso Rápido
              </h3>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Ver Conteúdos
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Agendar Consulta
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Enviar Mensagem
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentRole={user?.role || 'free'}
        onUpgrade={handleUpgrade}
      />
    </MainLayout>
  );
}
