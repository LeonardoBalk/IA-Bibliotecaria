import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import sergioImg from '../assets/sergio.png';

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
    <div className="min-h-screen bg-dark-bg flex transition-colors duration-300">
      {/* Left Side - Photo (Fixed position) */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-[45%]">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-dark-bg z-10" />

        {/* Subtle glow behind photo */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-neuro-green/15 rounded-full blur-3xl" />

        {/* Dr. Sérgio Photo - fixed position */}
        <img
          src={sergioImg}
          alt="Dr. Sérgio Spritzer"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-[85vh] object-contain opacity-90 z-[5]"
        />

        {/* Subtle accent glow */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-neuro-green/10 rounded-full blur-3xl" />
      </div>

      {/* Spacer for fixed left side */}
      <div className="hidden lg:block w-[45%] flex-shrink-0" />

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <img
                src="https://i.imgur.com/X6sfs4c.png"
                alt="Neurocom"
                className="w-10 h-10 object-contain"
              />
              <span className="text-dark-text font-semibold text-lg tracking-tight">Neurocom</span>
            </div>
            <p className="text-dark-text-secondary text-sm">
              Dr. Sérgio Spritzer
            </p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-dark-text mb-2">
              {isLogin ? 'Entrar' : 'Criar conta'}
            </h1>
            <p className="text-dark-text-secondary text-sm">
              {isLogin ? 'Acesse sua jornada de evolução' : 'Comece sua transformação pessoal'}
            </p>
          </div>

          {/* Error */}
          {erro && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {erro}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-dark-text-secondary text-sm mb-2">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-dark-text placeholder-dark-text-secondary/50 focus:outline-none focus:border-neuro-green/50 transition-colors text-sm"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label className="block text-dark-text-secondary text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-dark-text placeholder-dark-text-secondary/50 focus:outline-none focus:border-neuro-green/50 transition-colors text-sm"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-dark-text-secondary text-sm mb-2">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-dark-text placeholder-dark-text-secondary/50 focus:outline-none focus:border-neuro-green/50 transition-colors text-sm"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-neuro-green hover:bg-neuro-green-dark text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Aguarde...' : (isLogin ? 'Continuar' : 'Criar conta')}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-dark-border"></div>
            <span className="px-4 text-dark-text-secondary text-xs">ou</span>
            <div className="flex-1 border-t border-dark-border"></div>
          </div>

          {/* Google */}
          <div ref={googleBtnRef} className="flex justify-center"></div>

          {/* Toggle */}
          <p className="text-center text-dark-text-secondary mt-8 text-sm">
            {isLogin ? (
              <>
                Não tem conta?{' '}
                <button onClick={() => setIsLogin(false)} className="text-neuro-green hover:underline">
                  Criar agora
                </button>
              </>
            ) : (
              <>
                Já tem conta?{' '}
                <button onClick={() => setIsLogin(true)} className="text-neuro-green hover:underline">
                  Entrar
                </button>
              </>
            )}
          </p>

          {/* Footer */}
          <p className="text-center text-dark-text-secondary/40 text-xs mt-12">
            Método Dr. Sérgio Spritzer
          </p>
        </div>
      </div>
    </div>
  );
}
