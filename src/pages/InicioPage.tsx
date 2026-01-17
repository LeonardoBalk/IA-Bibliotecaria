import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function InicioPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await register(nome, email, senha);
      navigate('/dashboard');
    } catch (err: any) {
      setErro(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/convite')}
          className="text-dark-text-secondary hover:text-neuro-green transition-colors text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
        <button
          onClick={() => navigate('/login')}
          className="text-dark-text-secondary hover:text-neuro-green transition-colors text-sm"
        >
          Já tenho conta
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Video Section */}
        <div className="w-full max-w-2xl aspect-video bg-dark-surface rounded-2xl border border-dark-border mb-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-neuro-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neuro-green" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-dark-text-secondary text-sm">Vídeo de Boas-Vindas</p>
            <p className="text-dark-text-secondary/50 text-xs mt-1">(em breve)</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-dark-text mb-4">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-dark-text-secondary mb-8 max-w-md">
            Entre para a comunidade Neurocom e inicie seu processo de transformação pessoal.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-neuro-green hover:bg-neuro-green-dark text-white font-medium rounded-xl transition-all text-lg"
          >
            Viver a Imersão
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 flex items-center justify-center gap-4">
        <img
          src="https://i.imgur.com/X6sfs4c.png"
          alt="Neurocom"
          className="w-8 h-8 object-contain"
        />
        <p className="text-dark-text-secondary/60 text-sm">
          Método Dr. Sérgio Spritzer
        </p>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface border border-dark-border rounded-2xl w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-dark-text-secondary hover:text-dark-text transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-semibold text-dark-text mb-2 text-center">
              Crie sua conta
            </h2>
            <p className="text-dark-text-secondary text-sm mb-6 text-center">
              Comece sua jornada de evolução
            </p>

            {erro && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-dark-text-secondary text-sm mb-2">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-dark-text placeholder-dark-text-secondary/50 focus:outline-none focus:border-neuro-green/50 transition-colors text-sm"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-dark-text-secondary text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-dark-text placeholder-dark-text-secondary/50 focus:outline-none focus:border-neuro-green/50 transition-colors text-sm"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-dark-text-secondary text-sm mb-2">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-dark-text placeholder-dark-text-secondary/50 focus:outline-none focus:border-neuro-green/50 transition-colors text-sm"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-neuro-green hover:bg-neuro-green-dark text-white font-medium rounded-xl transition-all disabled:opacity-50 mt-4"
              >
                {loading ? 'Criando...' : 'Entrar na Comunidade'}
              </button>
            </form>

            <p className="text-center text-dark-text-secondary/60 text-xs mt-6">
              Ao criar sua conta, você concorda com nossos termos de uso.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
