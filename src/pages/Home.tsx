import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  // Redirecionar para dashboard se autenticado, senão para convite
  return <Navigate to={isAuthenticated ? '/dashboard' : '/convite'} replace />;
}
