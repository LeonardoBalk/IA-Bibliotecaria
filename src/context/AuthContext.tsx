import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: number;
  nome: string;
  email: string;
  role: 'free' | 'intermediate' | 'full';
  avatar_url?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  logout: () => void;
  register: (nome: string, email: string, senha: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: decodifica JWT
function decodeJwt(token: string) {
  try {
    const [, payload] = token.split('.');
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega auth do localStorage na inicialização
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userInfo');

    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // Se falhar, busca do /me
          fetchUser(storedToken);
        }
      } else {
        fetchUser(storedToken);
      }
    }

    setIsLoading(false);
  }, []);

  async function fetchUser(authToken: string) {
    try {
      const response = await api.get('/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData));
    } catch (error) {
      // Token inválido, limpa
      console.error('Erro ao buscar usuário:', error);
      logout();
    }
  }

  async function login(email: string, senha: string) {
    try {
      const response = await api.post('/login', { email, senha });
      const { token: newToken, usuario } = response.data;

      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);

      if (usuario) {
        setUser(usuario);
        localStorage.setItem('userInfo', JSON.stringify(usuario));
      } else {
        await fetchUser(newToken);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.erro || 'Erro ao fazer login');
    }
  }

  async function loginWithGoogle(googleToken: string) {
    try {
      const response = await api.post('/auth/google-token', { token: googleToken });
      const { token: newToken, usuario } = response.data;

      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);

      if (usuario) {
        setUser(usuario);
        localStorage.setItem('userInfo', JSON.stringify(usuario));
      } else {
        await fetchUser(newToken);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.erro || 'Erro ao fazer login com Google');
    }
  }

  async function register(nome: string, email: string, senha: string) {
    try {
      const response = await api.post('/usuarios', { nome, email, senha });
      const { token: newToken, usuario } = response.data;

      if (newToken) {
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setToken(newToken);

        if (usuario) {
          setUser(usuario);
          localStorage.setItem('userInfo', JSON.stringify(usuario));
        }
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.erro || 'Erro ao criar conta');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
