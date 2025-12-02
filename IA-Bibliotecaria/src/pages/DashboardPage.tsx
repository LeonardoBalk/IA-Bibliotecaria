import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { useUser } from '../context/UserContext';
import AIChat from '../components/AIChat';
import Modal from '../components/ui/Modal';

export default function DashboardPage() {
  const { user } = useUser();
  const [showAIChat, setShowAIChat] = useState(false);

  // Mock data - Minimalist
  const nextSteps = [
    { title: 'Introdução à Autopercepção', type: 'Vídeo', duration: '10 min' },
    { title: 'Mapeamento Emocional', type: 'Exercício', duration: '15 min' },
  ];

  const recentContent = [
    { title: 'Fundamentos da Neurocom', progress: 80 },
  ];

  return (
    <MainLayout>
      <div className="min-h-full p-8 md:p-12 relative overflow-hidden">

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-neuro-green/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-neuro-blue/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-12 relative z-10">

          {/* Minimalist Header */}
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-light text-light-text dark:text-white">
              Olá, <span className="font-semibold text-neuro-green">{user?.name}</span>
            </h1>
            <p className="text-light-text-secondary dark:text-gray-400 font-light text-lg">
              Sua evolução continua. O que vamos aprender hoje?
            </p>
          </div>

          {/* Continue Watching - Clean List */}
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-sm font-semibold text-light-text-secondary dark:text-gray-500 uppercase tracking-wider">
              Continuar de onde parou
            </h2>
            <div className="space-y-3">
              {recentContent.map((item, idx) => (
                <div key={idx} className="group bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-light-border dark:border-white/10 rounded-xl p-4 hover:border-neuro-green/30 transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-light-text dark:text-white group-hover:text-neuro-green transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs text-neuro-green font-medium">{item.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-light-border dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-neuro-green" style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations - Clean List */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-sm font-semibold text-light-text-secondary dark:text-gray-500 uppercase tracking-wider">
              Próximos Passos
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {nextSteps.map((item, idx) => (
                <div key={idx} className="group bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-light-border dark:border-white/10 rounded-xl p-5 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 cursor-pointer flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-neuro-blue bg-neuro-blue/10 px-2 py-1 rounded-md mb-2 inline-block">
                      {item.type}
                    </span>
                    <h3 className="font-medium text-light-text dark:text-white group-hover:text-neuro-green transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-light-surface dark:bg-white/5 flex items-center justify-center text-light-text-secondary dark:text-gray-400 group-hover:text-neuro-green group-hover:bg-neuro-green/10 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Floating AI Button */}
        <button
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-neuro-green hover:bg-neuro-green-dark text-white rounded-full shadow-lg shadow-neuro-green/30 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Abrir Assistente IA"
        >
          <svg className="w-7 h-7 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute right-full mr-3 bg-dark-surface text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            IA Guardiã
          </span>
        </button>

        {/* AI Chat Modal */}
        <Modal isOpen={showAIChat} onClose={() => setShowAIChat(false)} title="IA Guardiã">
          <div className="h-[500px]">
            <AIChat type="conversational" />
          </div>
        </Modal>

      </div>
    </MainLayout>
  );
}
