import MainLayout from '../components/MainLayout';
import { useAuth } from '../context/AuthContext';
import ConsultationBooking from '../components/ConsultationBooking';
import { useState } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import { UserRole } from '../types';

export default function ConsultasPage() {
  const { user } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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
  };

  const handleUpgrade = (role: UserRole) => {
    console.log('Upgrade to:', role);
    setShowUpgradeModal(false);
  };

  return (
    <MainLayout>
      <div className="p-8 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-2">Sessões Individuais</h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">Agende encontros personalizados com o Dr. Sérgio</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking */}
            <div className="lg:col-span-2">
              <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-3xl p-6">
                <ConsultationBooking
                  userRole={user?.role || 'free'}
                  onBook={handleBook}
                  onUpgrade={() => setShowUpgradeModal(true)}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Access Info */}
              <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-3xl p-5">
                <h3 className="font-semibold text-light-text dark:text-dark-text text-sm mb-4">Seu Acesso</h3>
                {user?.role === 'free' && (
                  <div>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-3">As sessões não estão disponíveis no plano gratuito.</p>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full py-2.5 rounded-2xl bg-neuro-green/10 text-neuro-green text-sm font-medium hover:bg-neuro-green/20 transition-colors"
                    >
                      Fazer upgrade
                    </button>
                  </div>
                )}
                {user?.role === 'intermediate' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Sessões restantes</span>
                      <span className="text-neuro-green text-sm font-semibold">2 de 3</span>
                    </div>
                    <div className="w-full h-2 bg-light-bg dark:bg-dark-bg rounded-full overflow-hidden">
                      <div className="h-full bg-neuro-green rounded-full" style={{ width: '66%' }}></div>
                    </div>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-2">Renova em 01/12</p>
                  </div>
                )}
                {user?.role === 'full' && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-neuro-green/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-neuro-green text-sm font-semibold">Sessões ilimitadas</span>
                      <p className="text-light-text-secondary dark:text-dark-text-secondary text-xs">Agende quantas precisar</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Guidelines */}
              <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-3xl p-5">
                <h3 className="font-semibold text-light-text dark:text-dark-text text-sm mb-4">Como Funciona</h3>
                <ul className="space-y-3">
                  {[
                    'Sessões de 50 minutos',
                    'Online via videoconferência',
                    'Cancele até 24h antes'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      <svg className="w-4 h-4 text-neuro-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* History */}
          {consultations.length > 0 && (
            <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-3xl p-6">
              <h2 className="text-light-text dark:text-dark-text font-semibold mb-5">Histórico de Sessões</h2>
              <div className="space-y-3">
                {consultations.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-light-bg dark:bg-dark-bg hover:bg-light-border/50 dark:hover:bg-dark-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-neuro-green/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-light-text dark:text-dark-text text-sm font-medium">{c.title}</h3>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary text-xs">
                          {new Date(c.date).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full ${c.status === 'completed'
                        ? 'bg-light-border dark:bg-dark-surface-hover text-light-text-secondary dark:text-dark-text-secondary'
                        : 'bg-neuro-green/10 text-neuro-green'
                      }`}>
                      {c.status === 'completed' ? 'Concluída' : 'Agendada'}
                    </span>
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
