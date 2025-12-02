import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/login/login.jsx";
import Chat from "./pages/chat/chat.jsx";
import Home from "./pages/home/home.jsx";
import Cadastro from "./pages/cadastro/cadastro.jsx";
import Sobre from "./pages/sobre/sobre.jsx";
import Convite from "./pages/convite/convite.jsx";
import Inicio from "./pages/inicio/inicio.jsx";
import Conteudos from "./pages/conteudos/conteudos.jsx";
import Planos from "./pages/planos/planos.jsx";
import Consultas from "./pages/consultas/consultas.jsx";
import Mensagens from "./pages/mensagens/mensagens.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";

// Rota protegida
function RotaProtegida({ children, logado }) {
  return logado ? children : <Navigate to="/login" replace />;
}

// Rota pública
function RotaPublica({ children, logado }) {
  return logado ? <Navigate to="/chat" replace /> : children;
}

// Função que valida o token
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000; // segundos
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch (e) {
    localStorage.removeItem("token");
    return false;
  }
}

function App() {
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const validar = () => setLogado(checkAuth());
    validar(); // checa na carga inicial

    // revalida a cada 1 min
    const interval = setInterval(validar, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rotas públicas de entrada */}
        <Route path="/convite" element={<Convite />} />
        <Route path="/inicio" element={<Inicio />} />

        {/* Rotas de autenticação */}
        <Route
          path="/login"
          element={
            <RotaPublica logado={logado}>
              <Login setLogado={setLogado} />
            </RotaPublica>
          }
        />
        <Route
          path="/cadastro"
          element={
            <RotaPublica logado={logado}>
              <Cadastro setLogado={setLogado} />
            </RotaPublica>
          }
        />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <RotaProtegida logado={logado}>
              <Chat />
            </RotaProtegida>
          }
        />
        <Route
          path="/chat"
          element={
            <RotaProtegida logado={logado}>
              <Chat />
            </RotaProtegida>
          }
        />

        <Route path="/conteudos" element={<Conteudos />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/mensagens" element={<Mensagens />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Rotas livres */}
        <Route path="/home" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/convite" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
