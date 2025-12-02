import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { User, Subscription } from '../types';

interface UserContextValue {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  updateSubscription: (sub: Subscription) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula verificação de sessão (substituir por chamada real)
    const storedUser = localStorage.getItem('neurocom-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Mock login - substituir por API real
    const mockUser: User = {
      id: '1',
      name: 'Usuário Teste',
      email,
      role: 'free',
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem('neurocom-user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const register = async (name: string, email: string) => {
    setLoading(true);
    // Mock register - substituir por API real
    const mockUser: User = {
      id: '1',
      name,
      email,
      role: 'free',
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem('neurocom-user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setSubscription(null);
    localStorage.removeItem('neurocom-user');
  };

  const updateSubscription = (sub: Subscription) => {
    setSubscription(sub);
  };

  return (
    <UserContext.Provider value={{ user, subscription, loading, login, register, logout, updateSubscription }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser deve ser usado dentro de UserProvider');
  return ctx;
}
