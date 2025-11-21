import MainLayout from '../components/MainLayout';
import { useUser } from '../context/UserContext';
import ConsultationBooking from '../components/ConsultationBooking';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useState } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import { UserRole } from '../types';

export default function ConsultasPage() {
  const { user } = useUser();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Mock consultation history
  const consultations = [
    {
      id: '1',
      title: 'Sessão Inicial',
      date: '2025-11-15T10:00:00',
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'Acompanhamento',
      date: '2025-11-22T14:00:00',
      status: 'scheduled' as const,
    },
  ];

  const handleBook = (date: string, time: string) => {
    console.log('Book consultation:', date, time);
    // Implementar integração com schedule service
  };

  const handleUpgrade = (role: UserRole) => {
    console.log('Upgrade to:', role);
    setShowUpgradeModal(false);
  };

  return (
    <MainLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
            Consultorias
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Agende sessões individuais com especialistas
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <ConsultationBooking
              userRole={user?.role || 'free'}
              onBook={handleBook}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Plan Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">
                Seu Acesso
              </h3>
              {user?.role === 'free' && (
                <div className="space-y-3">
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Consultorias não disponíveis no plano gratuito.
                  </p>
                  <Badge variant="neutral">Free</Badge>
                </div>
              )}
              {user?.role === 'intermediario' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Consultorias restantes
                    </span>
                    <Badge variant="primary">2 de 3</Badge>
                  </div>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    Renova no dia 01/12
                  </p>
                </div>
              )}
              {user?.role === 'full' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Ilimitadas</Badge>
                  </div>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Agende quantas consultorias precisar
                  </p>
                </div>
              )}
            </Card>

            {/* Guidelines */}
            <Card className="p-6">
              <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">
                Como Funcionam
              </h3>
              <ul className="space-y-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-neuro-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Sessões de 50 minutos</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-neuro-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Online via videoconferência</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-neuro-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Cancele até 24h antes</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-neuro-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Resumo enviado após sessão</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* History */}
        {consultations.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
              Histórico de Consultorias
            </h2>
            <div className="space-y-3">
              {consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="flex items-center justify-between p-4 rounded-neuro bg-light-bg dark:bg-dark-bg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-neuro bg-neuro-blue/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-neuro-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-light-text dark:text-dark-text">
                        {consultation.title}
                      </h3>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {new Date(consultation.date).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={consultation.status === 'completed' ? 'secondary' : 'primary'}>
                    {consultation.status === 'completed' ? 'Concluída' : 'Agendada'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
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
