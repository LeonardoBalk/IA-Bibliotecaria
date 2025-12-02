import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, User, ArrowRight, CheckCircle } from 'lucide-react';
import './inicio.css';

export default function Inicio() {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ nome: '', email: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulação
            await new Promise(resolve => setTimeout(resolve, 1500));
            navigate('/dashboard');
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inicio-page">
            {/* Header */}
            <header className="inicio-header">
                <img
                    src="https://i.imgur.com/knLE8C5.png"
                    alt="Neurocom"
                    className="header-logo"
                />
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content animate-enter">
                    <h1 className="hero-title">
                        A inteligência que cuida do seu fio.
                    </h1>
                    <p className="hero-description">
                        Plataforma exclusiva de aprendizado relacional e desenvolvimento humano.
                        Conecte-se com conteúdos profundos e consultorias especializadas.
                    </p>

                    <div className="hero-actions">
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary"
                        >
                            Começar Agora
                            <ArrowRight size={18} className="ml-2" />
                        </button>
                        <button className="btn-outline">
                            Saiba Mais
                        </button>
                    </div>
                </div>

                <div className="hero-visual animate-enter" style={{ animationDelay: '0.1s' }}>
                    <div className="visual-card">
                        <div className="visual-content">
                            {/* Placeholder visual - Clean */}
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                                    <User size={32} />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Dr. Sérgio Spritzer</h3>
                                <p className="text-sm text-secondary">Mentor e Especialista</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <User size={24} />
                            </div>
                            <h3>IA Relacional</h3>
                            <p>Uma inteligência treinada para entender o contexto humano e oferecer suporte real.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <CheckCircle size={24} />
                            </div>
                            <h3>Conteúdo Curado</h3>
                            <p>Acesso a materiais exclusivos, artigos e vídeos selecionados por especialistas.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Mail size={24} />
                            </div>
                            <h3>Conexão Direta</h3>
                            <p>Canal direto para consultorias e mensagens com a equipe Neurocom.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de Cadastro */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div
                        className="modal-content animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="modal-close"
                            onClick={() => setShowModal(false)}
                        >
                            <X size={20} />
                        </button>

                        <div className="modal-header">
                            <h2>Criar sua conta</h2>
                            <p>Junte-se à comunidade Neurocom</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="nome">Nome completo</label>
                                <input
                                    id="nome"
                                    type="text"
                                    placeholder="Seu nome"
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">E-mail profissional</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary btn-submit"
                                disabled={loading}
                            >
                                {loading ? 'Criando conta...' : 'Continuar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
