import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import './convite.css';

export default function Convite() {
    const navigate = useNavigate();

    return (
        <div className="convite-page">
            <div className="convite-container">
                {/* Header */}
                <header className="convite-header animate-enter">
                    <img
                        src="https://i.imgur.com/knLE8C5.png"
                        alt="Neurocom"
                        className="logo-img"
                    />
                </header>

                {/* Content */}
                <main className="convite-content">
                    {/* Video Section */}
                    <div className="video-wrapper animate-enter" style={{ animationDelay: '0.1s' }}>
                        {/* Placeholder - substituir pelo vídeo real */}
                        <div className="video-placeholder">
                            <button className="play-button" aria-label="Assistir vídeo">
                                <Play size={32} fill="currentColor" />
                            </button>
                            <p>Assista ao Manifesto Neurocom</p>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-content animate-enter" style={{ animationDelay: '0.2s' }}>
                        <h1 className="convite-title">
                            Bem-vindo à nova era da comunicação relacional
                        </h1>

                        <p className="convite-subtitle">
                            Uma plataforma desenhada para conectar inteligência e sensibilidade.
                            Descubra como a tecnologia pode ampliar sua capacidade humana.
                        </p>

                        <button
                            onClick={() => navigate('/inicio')}
                            className="btn-primary btn-start"
                        >
                            Começar Jornada
                            <ArrowRight size={20} className="ml-2" />
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
