import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import ConvitePage from './pages/ConvitePage';
import InicioPage from './pages/InicioPage';
import DashboardPage from './pages/DashboardPage';
import ConteudosPage from './pages/ConteudosPage';
import PlanosPage from './pages/PlanosPage';
import ConsultasPage from './pages/ConsultasPage';
import MensagensPage from './pages/MensagensPage';
import ChatPage from './pages/ChatPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';


function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/convite" element={<ConvitePage />} />
      <Route path="/inicio" element={<InicioPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/conteudos" element={<ProtectedRoute><ConteudosPage /></ProtectedRoute>} />
      <Route path="/planos" element={<ProtectedRoute><PlanosPage /></ProtectedRoute>} />
      <Route path="/consultas" element={<ProtectedRoute requiredRole="intermediate"><ConsultasPage /></ProtectedRoute>} />
      <Route path="/mensagens" element={<ProtectedRoute requiredRole="intermediate"><MensagensPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute requiredRole="full"><ChatPage /></ProtectedRoute>} />

      {/* Default */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
