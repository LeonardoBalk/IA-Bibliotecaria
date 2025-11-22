import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import AIChat from '../components/AIChat';
import Modal from '../components/ui/Modal';

export default function DashboardPage() {
  const { user } = useUser();
  const [showAIChat, setShowAIChat] = useState(false);

  // dados simulados - estatísticas do usuário
  const planNames = {
    free: 'Presença Aberta',
    intermediario: 'Círculo Implicado',
    full: 'Círculo Integral',
    admin: 'Administrador'
  };

  const userStats = [
    {
      label: 'Plano Atual',
      value: planNames[user?.role || 'free'],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: 'text-neuro-green'
    },
  ];

  // ações rápidas
  const quickActions = [
    {
      title: 'Conteúdos',
      desc: 'Acesse sua biblioteca',
      path: '/conteudos',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-neuro-blue/10 text-neuro-blue'
    },
    {
      title: 'Consultas',
      desc: 'Agende com Dr. Sérgio',
      path: '/consultas',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-neuro-green/10 text-neuro-green'
    },
    {
      title: 'Mensagens',
      desc: 'Tire suas dúvidas',
      path: '/mensagens',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-500/10 text-purple-500'
    },
    {
      title: 'Planos',
      desc: 'Evolua sua jornada',
      path: '/planos',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-orange-500/10 text-orange-500'
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-full p-8 md:p-12 relative overflow-hidden">

        {/* elementos de fundo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-neuro-green/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-neuro-blue/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">

          {/* cabeçalho minimalista */}
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-light text-light-text dark:text-white">
              Olá, <span className="font-semibold text-neuro-green">{user?.name}</span>
            </h1>
            <p className="text-light-text-secondary dark:text-gray-400 font-light text-lg">
              Sua evolução continua. O que vamos aprender hoje?
            </p>
          </div>

          {/* card único de estatísticas */}
          <div className="animate-slide-up">
            {userStats.map((stat, idx) => (
              <div key={idx} className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-light-border dark:border-white/10 rounded-2xl p-6 flex items-center gap-6 hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300 max-w-md">
                <div className={`p-3 rounded-xl bg-neuro-purple/10 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-light-text-secondary dark:text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color || 'text-light-text dark:text-white'}`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* grid de acesso rápido */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-sm font-semibold text-light-text-secondary dark:text-gray-500 uppercase tracking-wider">
              Acesso Rápido
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, idx) => (
                <Link
                  key={idx}
                  to={action.path}
                  className="group bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-light-border dark:border-white/10 rounded-2xl p-5 hover:border-neuro-green/30 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 cursor-pointer flex flex-col gap-3"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-light-text dark:text-white group-hover:text-neuro-green transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-light-text-secondary dark:text-gray-400 mt-1">
                      {action.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* botão flutuante da ia */}
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

        {/* modal da ia */}
        <Modal isOpen={showAIChat} onClose={() => setShowAIChat(false)} title="IA Guardiã">
          <div className="h-[500px]">
            <AIChat type="conversational" />
          </div>
        </Modal>

      </div>
    </MainLayout>
  );
}
