import MainLayout from '../components/MainLayout';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export default function PlanosPage() {
  const { user } = useAuth();

  const plans = [
    {
      role: 'free' as UserRole,
      name: 'Presença Aberta',
      price: 'Gratuito',
      description: 'Comece sua jornada de autoconhecimento',
      features: [
        'Acesso a conteúdos básicos',
        'IA Conversacional',
        'Comunidade geral',
      ],
    },
    {
      role: 'intermediate' as UserRole,
      name: 'Círculo Implicado',
      price: 'R$ 97',
      priceDetail: '/mês',
      description: 'Aprofunde seu desenvolvimento pessoal',
      features: [
        'Conteúdos intermediários',
        'Consultorias (3/mês)',
        'IA Guardiã parcial',
        'Suporte prioritário',
      ],
      highlighted: false,
    },
    {
      role: 'full' as UserRole,
      name: 'Círculo Integral',
      price: 'R$ 297',
      priceDetail: '/mês',
      description: 'Experiência completa de transformação',
      features: [
        'Todos os conteúdos',
        'Consultorias ilimitadas',
        'IA Guardiã completa',
        'Mensagens diretas',
        'Suporte VIP',
      ],
      highlighted: true,
    },
  ];

  const handleSelectPlan = (role: UserRole) => {
    if (role === user?.role) return;
    console.log('Select plan:', role);
  };

  return (
    <MainLayout>
      <div className="p-8 md:p-12">
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-light-text dark:text-dark-text mb-3">
              Escolha seu Caminho
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-xl mx-auto">
              Cada plano foi desenhado para acompanhar seu momento de vida e suas necessidades de crescimento.
            </p>
          </div>

          {/* Current Plan Badge */}
          {user && (
            <div className="bg-neuro-green/5 dark:bg-dark-surface rounded-2xl p-5 flex items-center justify-between border border-neuro-green/20 dark:border-dark-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-neuro-green/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-neuro-green text-xs font-medium mb-0.5">Seu plano atual</p>
                  <h3 className="text-light-text dark:text-dark-text font-semibold">
                    {plans.find(p => p.role === user.role)?.name}
                  </h3>
                </div>
              </div>
              <span className="bg-neuro-green text-white px-4 py-1.5 rounded-full text-xs font-medium">
                Ativo
              </span>
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = plan.role === user?.role;
              return (
                <div
                  key={plan.role}
                  className={`p-6 rounded-3xl transition-all duration-300 ${plan.highlighted
                    ? 'bg-light-surface dark:bg-dark-surface border-2 border-neuro-green/30 shadow-glow'
                    : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-neuro-green/30'
                    }`}
                >
                  {plan.highlighted && (
                    <span className="inline-block text-neuro-green text-xs font-semibold mb-4 bg-neuro-green/10 px-3 py-1 rounded-full">
                      Recomendado
                    </span>
                  )}

                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-1">{plan.name}</h3>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-5">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold text-light-text dark:text-dark-text">{plan.price}</span>
                    {plan.priceDetail && (
                      <span className="text-light-text-secondary dark:text-dark-text-secondary text-sm">{plan.priceDetail}</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <svg className="w-5 h-5 text-neuro-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan.role)}
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${isCurrent
                        ? 'bg-light-bg dark:bg-dark-bg text-light-text-secondary dark:text-dark-text-secondary cursor-not-allowed'
                        : plan.highlighted
                          ? 'bg-neuro-green hover:bg-neuro-green-dark text-white shadow-soft'
                          : 'bg-light-bg dark:bg-dark-bg hover:bg-light-border dark:hover:bg-dark-surface-hover text-light-text dark:text-dark-text'
                      }`}
                  >
                    {isCurrent ? 'Plano Atual' : 'Escolher este plano'}
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
