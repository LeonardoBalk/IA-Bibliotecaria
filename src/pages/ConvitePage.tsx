import { useState } from 'react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/neurocom-logo.png';

export default function ConvitePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-light-bg dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">

      {/* elementos de fundo para dar um ar moderno */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-neuro-green/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-neuro-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* cabeçalho com logo e mensagem de boas-vindas */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-6 z-10 mt-8 md:mt-12">
        <img
          src={logo}
          alt="Neurocom Logo"
          className="h-16 md:h-20 object-contain drop-shadow-lg animate-fade-in"
        />

        <div className="space-y-3 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-bold text-light-text dark:text-white tracking-tight">
            Bem-vindo à Neurocom
          </h1>
          <p className="text-lg md:text-xl text-light-text-secondary dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            Uma jornada de autodesenvolvimento guiada por inteligência artificial e neurociência aplicada.
          </p>
        </div>
      </div>

      {/* vídeo manifesto centralizado */}
      <div className="w-full max-w-5xl flex-1 flex items-center justify-center py-8 z-10">
        <div className="w-full aspect-video bg-dark-surface/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 relative group">
          {/* placeholder do player de vídeo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 transition-all duration-300 group-hover:text-neuro-green">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/20">
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-sm font-medium tracking-wider uppercase">Vídeo Manifesto</p>
          </div>
          {/* aqui entraria o embed do vídeo real */}
        </div>
      </div>

      {/* botão de chamada para ação */}
      <div className="w-full max-w-md flex flex-col items-center space-y-4 z-10 mb-8 md:mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Button
          variant="primary"
          onClick={() => navigate('/inicio')}
          className="w-full text-lg py-4 rounded-xl shadow-lg shadow-neuro-green/20 hover:shadow-neuro-green/40 bg-gradient-to-r from-neuro-green to-neuro-green-dark hover:from-neuro-green-light hover:to-neuro-green transition-all duration-300 transform hover:-translate-y-1"
        >
          Entrar na Jornada
        </Button>
      </div>

    </div>
  );
}
