import { useState } from 'react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function ConvitePage() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Video Manifesto */}
        <div className="aspect-video w-full bg-dark-surface rounded-neuro overflow-hidden shadow-neuro-md">
          <div className="w-full h-full flex items-center justify-center text-dark-text-secondary">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Vídeo Manifesto NEUROCOM</p>
              <p className="text-xs mt-1 opacity-70">(Integrar com player de vídeo)</p>
            </div>
          </div>
        </div>

        {/* Texto Inspirativo */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text">
            Bem-vindo à <span className="text-neuro-blue">NEUROCOM</span>
          </h1>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto leading-relaxed">
            Uma jornada de autodesenvolvimento guiada por inteligência artificial, 
            neurociência aplicada e acompanhamento especializado.
          </p>
          <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-xl mx-auto">
            Evolua em camadas: aproximação → autopercepção → estabilização → expansão → acompanhamento avançado.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-8">
          <Button 
            variant="primary" 
            onClick={() => navigate('/inicio')}
            className="text-lg px-12 py-4"
          >
            Entrar na Jornada
          </Button>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-4">
            Comece gratuitamente • Sem cartão de crédito
          </p>
        </div>
      </div>
    </div>
  );
}
