import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, senha);
      } else {
        if (!nome) {
          setErro('Preencha seu nome');
          setLoading(false);
          return;
        }
        await register(nome, email, senha);
      }
      navigate('/');
    } catch (error: any) {
      setErro(error.message || 'Erro ao processar');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleResponse(response: any) {
    try {
      setLoading(true);
      await loginWithGoogle(response.credential);
      navigate('/');
    } catch (error: any) {
      setErro(error.message || 'Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (GOOGLE_CLIENT_ID && window.google && googleBtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: isLogin ? 'signin_with' : 'signup_with',
      });
    }
  }, [isLogin]);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-neuro-green/10 dark:bg-white/[0.02] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-neuro-blue/10 dark:bg-white/[0.02] rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo & Welcome */}
        <div className="text-center mb-10">
          <img
            src="https://i.imgur.com/X6sfs4c.png"
            alt="Neurocom"
            className="w-16 h-16 mx-auto mb-5 object-contain"
          />
          <h1 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-2">
            {isLogin ? 'Bem-vindo de volta' : 'Comece sua jornada'}
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            {isLogin ? 'Continue sua evolução pessoal' : 'Um passo de cada vez, em direção à sua melhor versão'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-3xl p-8 shadow-medium border border-light-border dark:border-dark-border animate-slide-up">

          {erro && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl mb-6 text-sm text-center">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-light-text-secondary dark:text-dark-text-secondary text-sm mb-2 font-medium">Como podemos te chamar?</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3.5 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl text-light-text dark:text-dark-text placeholder-light-text-secondary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:border-neuro-green focus:ring-2 focus:ring-neuro-green/20 transition-all text-sm"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label className="block text-light-text-secondary dark:text-dark-text-secondary text-sm mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl text-light-text dark:text-dark-text placeholder-light-text-secondary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:border-neuro-green focus:ring-2 focus:ring-neuro-green/20 transition-all text-sm"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-light-text-secondary dark:text-dark-text-secondary text-sm mb-2 font-medium">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3.5 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl text-light-text dark:text-dark-text placeholder-light-text-secondary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:border-neuro-green focus:ring-2 focus:ring-neuro-green/20 transition-all text-sm"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-neuro-green hover:bg-neuro-green-dark text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-glow"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Um momento...
                </span>
              ) : (
                isLogin ? 'Entrar' : 'Começar minha jornada'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-light-border dark:border-dark-border"></div>
            <span className="px-4 text-light-text-secondary dark:text-dark-text-secondary text-xs">ou continue com</span>
            <div className="flex-1 border-t border-light-border dark:border-dark-border"></div>
          </div>

          {/* Google Sign In */}
          <div ref={googleBtnRef} className="flex justify-center"></div>

          {/* Toggle */}
          <p className="text-center text-light-text-secondary dark:text-dark-text-secondary mt-6 text-sm">
            {isLogin ? (
              <>
                Novo por aqui?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-neuro-green hover:underline font-semibold"
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-neuro-green hover:underline font-semibold"
                >
                  Entrar
                </button>
              </>
            )}
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-light-text-secondary/60 dark:text-dark-text-secondary/60 text-xs mt-8">
          Método Dr. Sérgio Spritzer
        </p>
      </div>
    </div>
  );
}
