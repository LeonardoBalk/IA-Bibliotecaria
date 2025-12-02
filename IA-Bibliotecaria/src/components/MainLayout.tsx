import { ReactNode } from 'react';
import { useUser } from '../context/UserContext';
import ThemeSwitcher from './ui/ThemeSwitcher';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/neurocom-logo.png';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useUser();
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard', label: 'Dashboard', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/conteudos', label: 'Conteúdos', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      path: '/consultas', label: 'Consultas', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      path: '/mensagens', label: 'Mensagens', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      path: '/planos', label: 'Planos', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen flex bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md border-r border-light-border dark:border-white/5 flex flex-col z-20">
        {/* Logo */}
        <div className="p-6 border-b border-light-border dark:border-white/5 flex items-center gap-3">
          <img src={logo} alt="Neurocom" className="h-8 w-auto object-contain" />
          <div>
            <h1 className="text-lg font-bold text-light-text dark:text-white tracking-tight">
              Neurocom
            </h1>
           
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-neuro-green/10 text-neuro-green'
                    : 'text-light-text-secondary dark:text-gray-400 hover:bg-light-bg dark:hover:bg-white/5 hover:text-light-text dark:hover:text-white'
                  }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-light-border dark:border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-neuro-green/10 flex items-center justify-center border border-neuro-green/20">
              <span className="text-sm font-bold text-neuro-green">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-light-text dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-light-text-secondary dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
            <ThemeSwitcher />
          </div>
          <button
            onClick={logout}
            className="w-full text-sm text-light-text-secondary dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors text-left pl-1"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
