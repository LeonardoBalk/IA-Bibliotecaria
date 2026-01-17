import { useNavigate } from 'react-router-dom';

export default function ConvitePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-end">
        <button
          onClick={() => navigate('/login')}
          className="text-dark-text-secondary hover:text-neuro-green transition-colors text-sm"
        >
          Já tenho conta
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-neuro-green/20 rounded-full blur-3xl scale-150" />
          <img
            src="https://i.imgur.com/X6sfs4c.png"
            alt="Neurocom"
            className="relative w-24 h-24 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-dark-text text-center mb-4">
          Neurocom
        </h1>
        <p className="text-dark-text-secondary text-center text-lg mb-8 max-w-md">
          Método Dr. Sérgio Spritzer
        </p>

        {/* Video Placeholder */}
        <div className="w-full max-w-2xl aspect-video bg-dark-surface rounded-2xl border border-dark-border mb-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-neuro-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neuro-green" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-dark-text-secondary text-sm">Vídeo Manifesto</p>
            <p className="text-dark-text-secondary/50 text-xs mt-1">(em breve)</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/inicio')}
          className="px-8 py-4 bg-neuro-green hover:bg-neuro-green-dark text-white font-medium rounded-xl transition-all text-lg"
        >
          Entrar com Presença
        </button>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-dark-text-secondary/40 text-xs">
          Neurocom - Método Dr. Sérgio Spritzer
        </p>
      </footer>
    </div>
  );
}
