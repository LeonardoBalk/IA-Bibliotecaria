import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'free' | 'intermediate' | 'full';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0e0e0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-[#2e2e2e] border-t-neuro-green mx-auto mb-3"></div>
          <p className="text-gray-500 dark:text-[#8b949e] text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && user) {
    const roleHierarchy = { free: 1, intermediate: 2, full: 3 };
    const userLevel = roleHierarchy[user.role] || 1;
    const requiredLevel = roleHierarchy[requiredRole] || 1;

    if (userLevel < requiredLevel) {
      const roleNames: Record<string, string> = {
        free: 'Gratuito',
        intermediate: 'Círculo Implicado',
        full: 'Círculo Integral'
      };

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0e0e0f] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#2e2e2e] rounded-lg p-8 max-w-sm text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-[#1f1f1f] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400 dark:text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 dark:text-[#8b949e] text-sm mb-4">
              Este conteúdo requer o plano <span className="text-neuro-green">{roleNames[requiredRole]}</span>.
            </p>
            <p className="text-gray-400 dark:text-[#6e7681] text-xs mb-5">
              Plano atual: <span className="text-gray-600 dark:text-[#8b949e]">{roleNames[user.role] || user.role}</span>
            </p>
            <a
              href="/planos"
              className="inline-block w-full py-2.5 bg-neuro-green hover:bg-neuro-green-dark text-white font-medium rounded-md text-sm transition-colors"
            >
              Ver Planos
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
