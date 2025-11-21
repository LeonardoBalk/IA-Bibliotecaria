import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';

// Pages
import ConvitePage from './pages/ConvitePage';
import InicioPage from './pages/InicioPage';
import DashboardPage from './pages/DashboardPage';
import ConteudosPage from './pages/ConteudosPage';
import PlanosPage from './pages/PlanosPage';
import ConsultasPage from './pages/ConsultasPage';
import MensagensPage from './pages/MensagensPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-neuro-blue border-t-transparent" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/inicio" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/convite" element={<ConvitePage />} />
      <Route path="/inicio" element={<InicioPage />} />
      
      {/* Private Routes */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/conteudos" element={<PrivateRoute><ConteudosPage /></PrivateRoute>} />
      <Route path="/planos" element={<PrivateRoute><PlanosPage /></PrivateRoute>} />
      <Route path="/consultas" element={<PrivateRoute><ConsultasPage /></PrivateRoute>} />
      <Route path="/mensagens" element={<PrivateRoute><MensagensPage /></PrivateRoute>} />
      
      {/* Default */}
      <Route path="/" element={<Navigate to="/convite" />} />
      <Route path="*" element={<Navigate to="/convite" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
