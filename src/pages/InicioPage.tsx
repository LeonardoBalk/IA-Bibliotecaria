import { useState } from 'react';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function InicioPage() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await register(name, email, senha);
      navigate('/dashboard');
    } catch (error: any) {
      setErro(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { id: 1, title: "Conteúdos Evolutivos", desc: "Vídeos e exercícios estruturados por níveis de profundidade." },
    { id: 2, title: "IA Personalizada", desc: "Duas IAs trabalham juntas: uma para conversar, outra para guiar." },
    { id: 3, title: "Acompanhamento", desc: "Consultorias individuais e mensagens diretas com especialistas." }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-light-bg dark:bg-dark-bg relative overflow-hidden transition-colors duration-300">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-neuro-green/5 dark:bg-white/[0.02] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-neuro-blue/5 dark:bg-white/[0.02] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl w-full z-10">
        {/* Logo */}
        <div className="flex justify-center mb-12 animate-fade-in">
          <div className="flex items-center gap-3">
            <img
              src="https://i.imgur.com/X6sfs4c.png"
              alt="Neurocom"
              className="w-12 h-12 object-contain"
            />
            <span className="text-light-text dark:text-dark-text font-semibold text-2xl">Neurocom</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Video */}
          <div className="animate-slide-up">
            <div className="aspect-video w-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-3xl overflow-hidden relative group cursor-pointer hover:border-neuro-green/30 transition-all duration-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-light-text-secondary dark:text-dark-text-secondary group-hover:text-neuro-green transition-colors">
                <div className="w-16 h-16 rounded-full bg-light-bg dark:bg-dark-bg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-light-border dark:border-dark-border">
                  <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-xs font-medium tracking-wider uppercase">Vídeo Introdutório</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-light-text dark:text-dark-text mb-4 tracking-tight">
                Metodologia Neurocom
              </h1>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                Uma plataforma que combina conteúdos profundos, inteligência artificial personalizada
                e acompanhamento especializado para guiar sua evolução.
              </p>
            </div>

            <div className="space-y-5">
              {features.map((item) => (
                <div key={item.id} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-2xl bg-neuro-green/10 dark:bg-dark-surface flex items-center justify-center flex-shrink-0 group-hover:bg-neuro-green/20 dark:group-hover:bg-dark-surface-hover transition-colors border border-neuro-green/20 dark:border-dark-border">
                    <span className="text-neuro-green font-semibold">{item.id}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-light-text dark:text-dark-text mb-1 group-hover:text-neuro-green transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full md:w-auto px-10 py-4 bg-neuro-green hover:bg-neuro-green-dark text-white font-semibold rounded-2xl shadow-soft hover:shadow-glow transition-all duration-200"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Cadastro */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Criar Conta">
        <form onSubmit={handleRegister} className="space-y-5">
          {erro && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm text-center">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-light-text-secondary dark:text-dark-text-secondary text-sm mb-2 font-medium">Nome completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl text-light-text dark:text-dark-text placeholder-light-text-secondary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:border-neuro-green focus:ring-2 focus:ring-neuro-green/20 transition-all text-sm"
              placeholder="Seu nome"
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-neuro-green hover:bg-neuro-green-dark text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Criando conta...' : 'Criar Conta Gratuita'}
          </button>

          <p className="text-light-text-secondary/60 dark:text-dark-text-secondary/60 text-xs text-center">
            Ao criar sua conta, você concorda com nossos termos de uso.
          </p>
        </form>
      </Modal>
    </div>
  );
}
