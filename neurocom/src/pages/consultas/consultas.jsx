import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import './consultas.css';

const mockConsultations = [
    {
        id: 1,
        date: '2023-11-25',
        time: '14:00',
        status: 'confirmed', // confirmed, pending, cancelled
        notes: 'Discussão sobre módulo 3'
    },
    {
        id: 2,
        date: '2023-12-02',
        time: '10:00',
        status: 'pending',
        notes: 'Dúvidas sobre aplicação prática'
    }
];

export default function Consultas() {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        notes: ''
    });

    // Mock user plan limits
    const userPlan = 'free'; // free, intermediate, full
    const limits = {
        free: 0,
        intermediate: 2,
        full: 999
    };

    const remainingConsultations = userPlan === 'free' ? 0 : 2; // Mock calculation

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Agendar:', formData);
        // Lógica de agendamento
    };

    return (
        <div className="consultas-page">
            {/* Header */}
            <header className="consultas-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>Agendamento de Consultorias</h1>
                        <p>Converse diretamente com especialistas para acelerar seu desenvolvimento</p>
                    </div>

                    <Link to="/dashboard" className="btn-back">
                        <ArrowLeft size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        Voltar
                    </Link>
                </div>
            </header>

            <div className="consultas-container">
                <div className="consultas-grid">
                    {/* Booking Form Column */}
                    <div className="section-card">
                        <div className="card-header">
                            <Calendar size={24} className="header-icon" />
                            <h2>Nova Consulta</h2>
                        </div>

                        {userPlan === 'free' ? (
                            <div className="upgrade-notice">
                                <AlertCircle size={48} />
                                <h3>Acesso Exclusivo</h3>
                                <p>
                                    O agendamento de consultorias está disponível para planos Intermediário e Completo.
                                    Faça um upgrade para desbloquear este recurso.
                                </p>
                                <Link to="/planos" className="btn-upgrade-link">
                                    Ver Planos Disponíveis
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="limit-info">
                                    <span className="limit-label">Consultas disponíveis este mês:</span>
                                    <span className="limit-value">{remainingConsultations} de {limits[userPlan] === 999 ? 'Ilimitado' : limits[userPlan]}</span>
                                </div>

                                <form onSubmit={handleSubmit} className="booking-form">
                                    <div className="form-group">
                                        <label>
                                            <Calendar /> Data
                                        </label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <Clock /> Horário
                                        </label>
                                        <select
                                            className="form-input"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            required
                                        >
                                            <option value="">Selecione um horário</option>
                                            <option value="09:00">09:00</option>
                                            <option value="10:00">10:00</option>
                                            <option value="11:00">11:00</option>
                                            <option value="14:00">14:00</option>
                                            <option value="15:00">15:00</option>
                                            <option value="16:00">16:00</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Observações (opcional)</label>
                                        <textarea
                                            className="form-textarea"
                                            rows="4"
                                            placeholder="Sobre o que você gostaria de conversar?"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-submit"
                                        disabled={remainingConsultations <= 0}
                                    >
                                        Confirmar Agendamento
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    {/* History Column */}
                    <div className="section-card">
                        <div className="card-header">
                            <Clock size={24} className="header-icon" />
                            <h2>Minhas Consultas</h2>
                        </div>

                        <div className="consultations-list">
                            {mockConsultations.length > 0 ? (
                                mockConsultations.map(consultation => (
                                    <div key={consultation.id} className="consultation-item">
                                        <div className="consultation-header">
                                            {consultation.status === 'confirmed' && <CheckCircle size={20} className="status-icon confirmed" />}
                                            {consultation.status === 'pending' && <Clock size={20} className="status-icon pending" />}
                                            {consultation.status === 'cancelled' && <XCircle size={20} className="status-icon cancelled" />}

                                            <span className="consultation-status">
                                                {consultation.status === 'confirmed' ? 'Confirmada' :
                                                    consultation.status === 'pending' ? 'Aguardando Confirmação' : 'Cancelada'}
                                            </span>
                                        </div>

                                        <div className="consultation-details">
                                            <div className="detail-row">
                                                <Calendar size={16} />
                                                {new Date(consultation.date).toLocaleDateString('pt-BR')}
                                            </div>
                                            <div className="detail-row">
                                                <Clock size={16} />
                                                {consultation.time}
                                            </div>
                                        </div>

                                        {consultation.notes && (
                                            <p className="consultation-notes">
                                                "{consultation.notes}"
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <p>Nenhuma consulta agendada.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
