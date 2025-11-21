import MainLayout from '../components/MainLayout';
import { useUser } from '../context/UserContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { UserRole } from '../types';

export default function PlanosPage() {
  const { user } = useUser();

  const plans = [
    {
      role: 'free' as UserRole,
      name: 'Presença Aberta',
      price: 'Gratuito',
      description: 'Comece sua jornada de autodesenvolvimento',
      features: [
        'Acesso a conteúdos básicos',
        'IA Conversacional básica',
        'Comunidade geral',
        'Exercícios introdutórios',
      ],
      limitations: [
        'Conteúdos limitados',
        'Sem consultorias',
        'IA Guardiã parcial',
      ],
    },
    {
      role: 'intermediario' as UserRole,
      name: 'Círculo Implicado',
      price: 'R$ 97',
      priceDetail: '/mês',
      description: 'Aprofunde seu desenvolvimento',
      features: [
        'Todos os conteúdos intermediários',
        'Consultorias limitadas (3/mês)',
        'IA Guardiã parcial',
        'Exercícios de autopercepção',
        'Suporte prioritário',
        'Estatísticas de progresso',
      ],
      highlighted: false,
    },
    {
      role: 'full' as UserRole,
      name: 'Círculo Integral',
      price: 'R$ 297',
      priceDetail: '/mês',
      description: 'Acesso completo à transformação',
      features: [
        'Acesso total a todos os conteúdos',
        'Consultorias ilimitadas',
        'IA Guardiã completa e personalizada',
        'Acompanhamento estatístico avançado',
        'Exercícios evolutivos completos',
        'Mensagens diretas com especialistas',
        'Suporte VIP',
        'Comunidade exclusiva',
        'Material exclusivo de imersão',
      ],
      highlighted: true,
    },
  ];

  const handleSelectPlan = (role: UserRole) => {
    if (role === user?.role) return;
    console.log('Select plan:', role);
    // Implementar integração com payment service
  };

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-4">
            Escolha seu Caminho de Evolução
          </h1>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
            Cada plano foi desenhado para acompanhar seu momento na jornada. 
            Você pode evoluir quando estiver pronto.
          </p>
        </div>

        {/* Current Plan */}
        {user && (
          <Card className="p-6 bg-neuro-blue/5 border-neuro-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Seu plano atual
                </p>
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
                  {plans.find(p => p.role === user.role)?.name}
                </h3>
              </div>
              <Badge variant="primary" className="text-base px-4 py-1.5">
                Ativo
              </Badge>
            </div>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.role === user?.role;
            const isDowngrade = user && plans.findIndex(p => p.role === user.role) > plans.findIndex(p => p.role === plan.role);

            return (
              <Card
                key={plan.role}
                className={`p-6 relative ${
                  plan.highlighted
                    ? 'ring-2 ring-neuro-blue shadow-neuro-md'
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="secondary" className="text-sm px-4 py-1">
                      Recomendado
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-neuro-blue">
                      {plan.price}
                    </span>
                    {plan.priceDetail && (
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">
                        {plan.priceDetail}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-neuro-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-light-text dark:text-dark-text">
                        {feature}
                      </span>
                    </div>
                  ))}
                  
                  {plan.limitations && plan.limitations.map((limitation, index) => (
                    <div key={`lim-${index}`} className="flex items-start gap-2 opacity-50">
                      <svg className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {limitation}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.role)}
                  disabled={isCurrent || isDowngrade}
                >
                  {isCurrent ? 'Plano Atual' : isDowngrade ? 'Indisponível' : 'Selecionar Plano'}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6 text-center">
            Perguntas Frequentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 rounded-neuro bg-light-bg dark:bg-dark-bg">
                <span className="font-medium text-light-text dark:text-dark-text">
                  Posso cancelar a qualquer momento?
                </span>
                <svg className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="p-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento.
              </p>
            </details>

            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 rounded-neuro bg-light-bg dark:bg-dark-bg">
                <span className="font-medium text-light-text dark:text-dark-text">
                  Posso fazer upgrade depois?
                </span>
                <svg className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="p-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Sim, você pode fazer upgrade a qualquer momento. O valor será ajustado proporcionalmente.
              </p>
            </details>

            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 rounded-neuro bg-light-bg dark:bg-dark-bg">
                <span className="font-medium text-light-text dark:text-dark-text">
                  Como funcionam as consultorias?
                </span>
                <svg className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="p-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                As consultorias são sessões individuais online com especialistas. Você agenda diretamente pela plataforma.
              </p>
            </details>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
