import { useState } from 'react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/neurocom-logo.png';

export default function InicioPage() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { register } = useUser();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-light-bg dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">

      {/* elementos de fundo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-neuro-green/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-neuro-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl w-full z-10">

        {/* cabeçalho com logo */}
        <div className="flex justify-center mb-8 md:mb-12 animate-fade-in">
          <img src={logo} alt="Neurocom Logo" className="h-12 md:h-16 object-contain drop-shadow-md" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">

          {/* seção do vídeo introdutório */}
          <div className="order-2 md:order-1 animate-slide-up">
            <div className="aspect-video w-full bg-dark-surface/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 relative group">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 transition-all duration-300 group-hover:text-neuro-green">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-xs font-medium tracking-wider uppercase">Vídeo Introdutório</p>
              </div>
            </div>
          </div>

          {/* seção de conteúdo explicativo */}
          <div className="order-1 md:order-2 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-light-text dark:text-white mb-4 tracking-tight">
                Metodologia Neurocom
              </h1>
              <p className="text-lg text-light-text-secondary dark:text-gray-300 leading-relaxed">
                Nossa plataforma combina conteúdos profundos, inteligência artificial personalizada
                e acompanhamento especializado para guiar sua evolução.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { id: 1, title: "Conteúdos Evolutivos", desc: "Vídeos, textos e exercícios estruturados por níveis de complexidade." },
                { id: 2, title: "IA Personalizada", desc: "Duas IAs trabalham juntas: uma para conversar e outra para guiar sua jornada." },
                { id: 3, title: "Acompanhamento Especializado", desc: "Consultorias individuais e mensagens diretas com especialistas." }
              ].map((item, idx) => (
                <div key={item.id} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-neuro-green/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-neuro-green/20 transition-colors duration-300">
                    <span className="text-neuro-green font-bold text-lg">{item.id}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-light-text dark:text-white mb-1 group-hover:text-neuro-green transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-light-text-secondary dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                className="w-full md:w-auto px-10 py-4 text-lg rounded-xl shadow-lg shadow-neuro-green/20 hover:shadow-neuro-green/40 bg-gradient-to-r from-neuro-green to-neuro-green-dark hover:from-neuro-green-light hover:to-neuro-green transition-all duration-300 transform hover:-translate-y-1"
              >
                Começar Agora
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* modal de cadastro */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Criar Conta">
        <form onSubmit={handleRegister} className="space-y-5">
          <Input
            label="Nome completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
            className="bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border focus:ring-neuro-green"
          />
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border focus:ring-neuro-green"
          />
          <Button type="submit" variant="primary" className="w-full py-3 bg-neuro-green hover:bg-neuro-green-dark text-white font-bold rounded-lg shadow-md transition-all">
            Criar Conta Gratuita
          </Button>
          <p className="text-xs text-center text-light-text-secondary dark:text-dark-text-secondary">
            Ao criar sua conta, você concorda com nossos termos de uso.
          </p>
        </form>
      </Modal>
    </div>
  );
}
