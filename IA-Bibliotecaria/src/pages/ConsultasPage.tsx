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

  // histórico simulado de consultorias
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
    // implementar integração com serviço de agendamento
  };

  const handleUpgrade = (role: UserRole) => {
    console.log('Upgrade to:', role);
    setShowUpgradeModal(false);
  };

  return (
    <MainLayout>
      <div className="min-h-full p-8 md:p-12 relative overflow-hidden">

        {/* elementos de fundo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-neuro-green/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-neuro-blue/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          {/* cabeçalho */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-light-text dark:text-white mb-2 tracking-tight">
              Consultorias
            </h1>
            <p className="text-light-text-secondary dark:text-gray-400">
              Agende sessões individuais com especialistas
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 animate-slide-up">
            {/* formulário de agendamento */}
            <div className="lg:col-span-2">
              <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-light-border dark:border-white/10 rounded-2xl p-6 shadow-xl">
                <ConsultationBooking
                  userRole={user?.role || 'free'}
                  onBook={handleBook}
                  onUpgrade={() => setShowUpgradeModal(true)}
                />
              </div>
            </div>

            {/* barra lateral de informações */}
            <div className="space-y-6">
              {/* informações do plano */}
              <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-light-border dark:border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-light-text dark:text-white mb-4">
                  Seu Acesso
                </h3>
                {user?.role === 'free' && (
                  <div className="space-y-3">
                    <p className="text-sm text-light-text-secondary dark:text-gray-400">
                      Consultorias não disponíveis no plano gratuito.
                    </p>
                    <Badge variant="neutral">Free</Badge>
                  </div>
                )}
                {user?.role === 'intermediario' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-light-text-secondary dark:text-gray-400">
                        Consultorias restantes
                      </span>
                      <Badge variant="primary">2 de 3</Badge>
                    </div>
                    <p className="text-xs text-light-text-secondary dark:text-gray-500">
                      Renova no dia 01/12
                    </p>
                  </div>
                )}
                {user?.role === 'full' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Ilimitadas</Badge>
                    </div>
                    <p className="text-sm text-light-text-secondary dark:text-gray-400">
                      Agende quantas consultorias precisar
                    </p>
                  </div>
                )}
              </div>

              {/* diretrizes */}
              <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-light-border dark:border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-light-text dark:text-white mb-4">
                  Como Funcionam
                </h3>
                <ul className="space-y-4 text-sm text-light-text-secondary dark:text-gray-400">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-neuro-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Sessões de 50 minutos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-neuro-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Online via videoconferência</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-neuro-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Cancele até 24h antes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* histórico */}
          {consultations.length > 0 && (
            <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-light-border dark:border-white/10 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-lg font-semibold text-light-text dark:text-white mb-6">
                Histórico de Consultorias
              </h2>
              <div className="space-y-3">
                {consultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-light-border dark:border-white/5 hover:border-neuro-green/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neuro-green/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-light-text dark:text-white">
                          {consultation.title}
                        </h3>
                        <p className="text-sm text-light-text-secondary dark:text-gray-400">
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
            </div>
          )}
        </div>

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentRole={user?.role || 'free'}
          onUpgrade={handleUpgrade}
        />
      </div>
    </MainLayout>
  );
}
