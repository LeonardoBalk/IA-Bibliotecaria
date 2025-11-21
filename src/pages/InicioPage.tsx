import { useState } from 'react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Video */}
          <div className="aspect-video w-full bg-dark-surface rounded-neuro overflow-hidden shadow-neuro-md">
            <div className="w-full h-full flex items-center justify-center text-dark-text-secondary">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">Vídeo Introdutório</p>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-4">
                Metodologia <span className="text-neuro-blue">NEUROCOM</span>
              </h1>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed mb-6">
                Nossa plataforma combina conteúdos profundos, inteligência artificial personalizada 
                e acompanhamento especializado para guiar sua evolução.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neuro-blue/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-neuro-blue font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text mb-1">
                    Conteúdos Evolutivos
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Vídeos, textos e exercícios estruturados por níveis de complexidade.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neuro-blue/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-neuro-blue font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text mb-1">
                    IA Personalizada
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Duas IAs trabalham juntas: uma para conversar e outra para guiar sua jornada.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neuro-blue/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-neuro-blue font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text mb-1">
                    Acompanhamento Especializado
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Consultorias individuais e mensagens diretas com especialistas.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                variant="primary" 
                onClick={() => setShowModal(true)}
                className="w-full md:w-auto px-8"
              >
                Começar Agora
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Cadastro */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Criar Conta">
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Nome completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
          />
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
          <Button type="submit" variant="primary" className="w-full">
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
