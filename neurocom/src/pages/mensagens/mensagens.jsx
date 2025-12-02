import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Paperclip, MessageCircle, CheckCircle2, ArrowLeft, X } from 'lucide-react';
import './mensagens.css';

const mockMessages = [
    {
        id: 1,
        content: 'Gostaria de saber mais sobre como aplicar a técnica de espelhamento em reuniões online.',
        date: '2023-11-18 14:30',
        status: 'answered',
        response: 'Ótima pergunta! Em reuniões online, o espelhamento pode ser feito através do tom de voz e ritmo da fala, já que a linguagem corporal é limitada. Tente observar a velocidade da fala do outro e ajustar a sua.'
    },
    {
        id: 2,
        content: 'Qual a melhor forma de lidar com feedback negativo?',
        date: '2023-11-19 09:15',
        status: 'pending',
        response: null
    }
];

export default function Mensagens() {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        console.log('Enviar:', { message, file });
        setMessage('');
        setFile(null);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="mensagens-page">
            {/* Header */}
            <header className="mensagens-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>Mensagens Diretas</h1>
                        <p>Tire suas dúvidas e receba orientações da equipe Neurocom</p>
                    </div>

                    <Link to="/dashboard" className="btn-back">
                        <ArrowLeft size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        Voltar
                    </Link>
                </div>
            </header>

            <div className="mensagens-container">
                <div className="mensagens-grid">
                    {/* Form Section */}
                    <div className="form-section">
                        <div className="section-card">
                            <div className="section-title">
                                <Send size={20} className="text-brand" />
                                Nova Mensagem
                            </div>

                            <form onSubmit={handleSend} className="message-form">
                                <textarea
                                    className="form-textarea"
                                    rows="6"
                                    placeholder="Digite sua mensagem aqui..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>

                                <div className="file-upload">
                                    <label className="file-label">
                                        <Paperclip size={18} />
                                        Anexar arquivo (opcional)
                                        <input
                                            type="file"
                                            className="file-input"
                                            onChange={handleFileChange}
                                        />
                                    </label>

                                    {file && (
                                        <div className="file-preview">
                                            <Paperclip size={14} />
                                            <span>{file.name}</span>
                                            <button
                                                type="button"
                                                className="btn-remove-file"
                                                onClick={() => setFile(null)}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn-primary w-full">
                                    Enviar Mensagem
                                </button>

                                <p className="form-note">
                                    Tempo médio de resposta: 24 horas úteis.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="list-section">
                        <div className="section-card">
                            <div className="section-title">
                                <MessageCircle size={20} className="text-brand" />
                                Histórico
                            </div>

                            <div className="messages-list">
                                {mockMessages.map(msg => (
                                    <div key={msg.id} className="message-item">
                                        <div className="message-header">
                                            <span className={`status-badge badge-${msg.status}`}>
                                                {msg.status === 'answered' ? 'Respondida' : 'Pendente'}
                                            </span>
                                            <span className="message-date">{msg.date}</span>
                                        </div>

                                        <div className="message-content">
                                            <p className="message-text">{msg.content}</p>
                                        </div>

                                        {msg.response && (
                                            <div className="admin-response">
                                                <div className="response-header">
                                                    <CheckCircle2 size={16} className="inline mr-2 text-brand" />
                                                    <strong>Resposta Neurocom:</strong>
                                                </div>
                                                <p className="response-text">{msg.response}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
