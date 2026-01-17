import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ui/ThemeSwitcher';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard', label: 'Início', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/conteudos', label: 'Jornada', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      path: '/consultas', label: 'Sessões', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      path: '/mensagens', label: 'Conversas', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      path: '/chat', label: 'IA Chat', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611L19 20.5l-1.892-.14a3.003 3.003 0 01-2.508-2.509L14.5 16M5 14.5l-1.402 1.402c-1.232 1.232-.65 3.318 1.067 3.611L6 20.5l1.892-.14a3.003 3.003 0 002.508-2.509L10.5 16" />
        </svg>
      )
    },
    {
      path: '/planos', label: 'Planos', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      {/* Sidebar - Fixed */}
      <aside className="fixed top-0 left-0 h-screen w-72 bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <img
              src="https://i.imgur.com/X6sfs4c.png"
              alt="Neurocom"
              className="w-10 h-10 object-contain"
            />
            <div>
              <span className="text-light-text dark:text-dark-text font-semibold text-lg">Neurocom</span>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Dr. Sérgio Spritzer</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                  ? 'bg-neuro-green/10 text-neuro-green'
                  : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg dark:hover:bg-dark-bg hover:text-light-text dark:hover:text-dark-text'
                  }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-light-border dark:border-dark-border">
          <div className="bg-light-bg dark:bg-dark-bg rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-neuro-green/20 dark:bg-dark-surface-hover flex items-center justify-center border border-neuro-green/20 dark:border-dark-border">
                <span className="text-sm font-semibold text-neuro-green dark:text-dark-text">
                  {user?.nome?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-light-text dark:text-dark-text truncate">
                  {user?.nome}
                </p>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary capitalize">
                  {user?.role === 'free' ? 'Explorador' : user?.role === 'intermediate' ? 'Praticante' : 'Mestre'}
                </p>
              </div>
              <ThemeSwitcher />
            </div>
            <button
              onClick={logout}
              className="w-full text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-red-500 transition-colors text-center py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Sair da conta
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 min-h-screen overflow-auto relative">
        {/* Background Decoration - mais sutil */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-neuro-green/5 dark:bg-white/[0.02] rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-neuro-blue/5 dark:bg-white/[0.02] rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
