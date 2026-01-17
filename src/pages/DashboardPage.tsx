import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../context/AuthContext';
import AIChat from '../components/AIChat';
import Modal from '../components/ui/Modal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [showAIChat, setShowAIChat] = useState(false);

  const nextSteps = [
    { title: 'Introdução à Autopercepção', type: 'Vídeo', duration: '10 min' },
    { title: 'Mapeamento Emocional', type: 'Exercício', duration: '15 min' },
  ];

  const recentContent = [
    { title: 'Fundamentos da Neurocom', progress: 80 },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <MainLayout>
      <div className="min-h-full p-8 md:p-12">
        <div className="max-w-3xl mx-auto space-y-10 animate-fade-in">

          {/* Greeting Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-light-text dark:text-dark-text">
              {greeting()}, <span className="text-neuro-green">{user?.nome?.split(' ')[0]}</span>
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg">
              Como está se sentindo hoje? Pronto para mais um passo na sua jornada?
            </p>
          </div>

          {/* Quick Check-in Card */}
          <div className="bg-neuro-green/5 dark:bg-dark-surface rounded-3xl p-6 border border-neuro-green/20 dark:border-dark-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-dark-bg flex items-center justify-center shadow-soft">
                <svg className="w-7 h-7 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-light-text dark:text-dark-text mb-1">Momento de Presença</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Antes de continuar, respire fundo 3 vezes. Você está aqui, e isso é o que importa.
                </p>
              </div>
            </div>
          </div>

          {/* Continue Learning */}
          {recentContent.length > 0 && (
            <div className="space-y-4 animate-slide-up">
              <h2 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                Continue de onde parou
              </h2>
              <div className="space-y-3">
                {recentContent.map((item, idx) => (
                  <div key={idx} className="group bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-5 hover:border-neuro-green/40 dark:hover:border-dark-surface-hover hover:shadow-soft transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-light-text dark:text-dark-text group-hover:text-neuro-green transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-sm text-neuro-green font-semibold">{item.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-light-bg dark:bg-dark-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neuro-green to-neuro-green-light rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
              Próximos passos sugeridos
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {nextSteps.map((item, idx) => (
                <div key={idx} className="group bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-5 hover:border-neuro-green/40 dark:hover:border-dark-surface-hover hover:shadow-soft transition-all duration-300 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-light-bg dark:bg-dark-bg flex items-center justify-center group-hover:scale-105 transition-transform">
                      {item.type === 'Vídeo' ? (
                        <svg className="w-5 h-5 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-medium text-neuro-green bg-neuro-green/10 dark:bg-neuro-green/20 px-2.5 py-1 rounded-full">
                        {item.type}
                      </span>
                      <h3 className="font-medium text-light-text dark:text-dark-text mt-2 group-hover:text-neuro-green transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                        {item.duration}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Floating AI Chat Button */}
        <button
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-neuro-green hover:bg-neuro-green-dark text-white rounded-3xl shadow-glow flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg z-50 group"
          aria-label="Abrir Assistente IA"
        >
          <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        {/* AI Chat Modal */}
        <Modal isOpen={showAIChat} onClose={() => setShowAIChat(false)} title="IA Guardiã" size="lg">
          <AIChat type="guardian" />
        </Modal>

      </div>
    </MainLayout>
  );
}
