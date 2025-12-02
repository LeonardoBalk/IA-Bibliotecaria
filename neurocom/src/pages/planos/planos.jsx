import { Check, Crown, Sparkles, Zap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './planos.css';

const plans = [
    {
        id: 'free',
        name: 'Gratuito',
        price: '0',
        period: '/mês',
        description: 'Para começar sua jornada de autoconhecimento.',
        features: [
            'Acesso a conteúdos introdutórios',
            '1 consulta experimental',
            'Newsletter mensal',
            'Comunidade básica'
        ],
        icon: Sparkles,
        color: 'gray',
        buttonText: 'Plano Atual'
    },
    {
        id: 'intermediate',
        name: 'Intermediário',
        price: '97',
        period: '/mês',
        description: 'Aprofunde seus conhecimentos com acesso expandido.',
        features: [
            'Todo conteúdo gratuito',
            'Acesso a cursos intermediários',
            '2 consultorias mensais',
            'Suporte prioritário',
            'Materiais complementares'
        ],
        icon: Zap,
        color: 'green',
        buttonText: 'Assinar Intermediário',
        popular: true
    },
    {
        id: 'full',
        name: 'Completo',
        price: '297',
        period: '/mês',
        description: 'A experiência definitiva de transformação.',
        features: [
            'Acesso ilimitado a tudo',
            'Consultorias semanais',
            'Mentoria direta com Dr. Sérgio',
            'Certificação Neurocom',
            'Eventos exclusivos presenciais'
        ],
        icon: Crown,
        color: 'blue',
        buttonText: 'Assinar Completo'
    }
];

export default function Planos() {
    // Mock user plan
    const currentPlan = 'free';

    const handleSubscribe = (planId) => {
        console.log('Subscribe to:', planId);
        // Integração com Stripe aqui
    };

    return (
        <div className="planos-page">
            {/* Header */}
            <header className="planos-header">
                <h1>Escolha o plano ideal para sua evolução</h1>
                <p>
                    Invista em você com planos flexíveis que acompanham seu ritmo de desenvolvimento.
                    Cancele ou altere a qualquer momento.
                </p>
            </header>

            {/* Plans Grid */}
            <div className="planos-container">
                <div className="plans-grid">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        const isCurrent = currentPlan === plan.id;

                        return (
                            <div
                                key={plan.id}
                                className={`plan-card ${plan.popular ? 'popular' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="popular-badge">Mais Popular</div>
                                )}

                                <div className="plan-header">
                                    <div className={`plan-icon icon-${plan.color}`}>
                                        <Icon size={32} />
                                    </div>
                                    <h2 className="plan-name">{plan.name}</h2>
                                    <p className="plan-description">{plan.description}</p>
                                </div>

                                <div className="plan-price">
                                    <span className="price-value">R$ {plan.price}</span>
                                    <span className="price-period">{plan.period}</span>
                                </div>

                                <ul className="plan-features">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="feature">
                                            <Check size={18} className="check-icon" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`btn-plan btn-${plan.color}`}
                                    disabled={isCurrent}
                                    onClick={() => handleSubscribe(plan.id)}
                                >
                                    {isCurrent ? 'Seu Plano Atual' : plan.buttonText}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="planos-footer">
                    <p>Dúvidas sobre os planos? Entre em contato com nossa equipe.</p>
                    <Link to="/dashboard" className="link-back">
                        Voltar ao Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
