import { useNavigate } from 'react-router-dom';

export default function ConvitePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-light-bg dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-neuro-green/5 dark:bg-white/[0.02] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-neuro-blue/5 dark:bg-white/[0.02] rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-6 z-10 mt-8 md:mt-16 animate-fade-in">
        <img
          src="https://i.imgur.com/X6sfs4c.png"
          alt="Neurocom"
          className="w-20 h-20 object-contain"
        />

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-light-text dark:text-dark-text tracking-tight">
            Bem-vindo à Neurocom
          </h1>
          <p className="text-lg md:text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto leading-relaxed">
            Uma jornada de autodesenvolvimento guiada por inteligência artificial e neurociência aplicada.
          </p>
        </div>
      </div>

      {/* Video Section */}
      <div className="w-full max-w-4xl flex-1 flex items-center justify-center py-8 z-10 animate-slide-up">
        <div className="w-full aspect-video bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-3xl overflow-hidden relative group cursor-pointer hover:border-neuro-green/30 transition-all duration-300">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-light-text-secondary dark:text-dark-text-secondary group-hover:text-neuro-green transition-colors">
            <div className="w-20 h-20 rounded-full bg-light-bg dark:bg-dark-bg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-light-border dark:border-dark-border">
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-sm font-medium tracking-wider uppercase">Vídeo Manifesto</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full max-w-md flex flex-col items-center space-y-4 z-10 mb-8 md:mb-16">
        <button
          onClick={() => navigate('/inicio')}
          className="w-full py-4 bg-neuro-green hover:bg-neuro-green-dark text-white font-semibold rounded-2xl transition-all duration-200 shadow-soft hover:shadow-glow"
        >
          Entrar na Jornada
        </button>
        <p className="text-light-text-secondary/60 dark:text-dark-text-secondary/60 text-xs">
          Método Dr. Sérgio Spritzer
        </p>
      </div>
    </div>
  );
}
