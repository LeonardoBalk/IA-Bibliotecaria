import MainLayout from '../components/MainLayout';
import { useUser } from '../context/UserContext';
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
    // implementar integração com serviço de pagamento
  };

  return (
    <MainLayout>
      <div className="min-h-full p-8 md:p-12 relative overflow-hidden">

        {/* elementos de fundo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-neuro-green/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-neuro-blue/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* cabeçalho */}
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-bold text-light-text dark:text-white mb-4 tracking-tight">
              Escolha seu Caminho de Evolução
            </h1>
            <p className="text-lg text-light-text-secondary dark:text-gray-400 font-light">
              Cada plano foi desenhado para acompanhar seu momento na jornada.
              Você pode evoluir quando estiver pronto.
            </p>
          </div>

          {/* plano atual */}
          {user && (
            <div className="bg-neuro-green/10 border border-neuro-green/30 rounded-2xl p-6 animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neuro-green font-medium mb-1">
                    Seu plano atual
                  </p>
                  <h3 className="text-xl font-bold text-light-text dark:text-white">
                    {plans.find(p => p.role === user.role)?.name}
                  </h3>
                </div>
                <div className="bg-neuro-green text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-neuro-green/20">
                  Ativo
                </div>
              </div>
            </div>
          )}

          {/* grid de planos */}
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {plans.map((plan) => {
              const isCurrent = plan.role === user?.role;
              const isDowngrade = user && plans.findIndex(p => p.role === user.role) > plans.findIndex(p => p.role === plan.role);

              return (
                <div
                  key={plan.role}
                  className={`p-8 relative rounded-3xl transition-all duration-300 ${plan.highlighted
                    ? 'bg-white/10 dark:bg-white/5 backdrop-blur-md border-2 border-neuro-green shadow-2xl shadow-neuro-green/10 transform md:-translate-y-4'
                    : 'bg-white/50 dark:bg-white/5 backdrop-blur-md border border-light-border dark:border-white/10 hover:border-neuro-green/30'
                    }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-neuro-green text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-neuro-green/30 uppercase tracking-wider">
                        Recomendado
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-light-text dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-light-text-secondary dark:text-gray-400 mb-6 h-10">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-light-text dark:text-white">
                        {plan.price}
                      </span>
                      {plan.priceDetail && (
                        <span className="text-light-text-secondary dark:text-gray-500">
                          {plan.priceDetail}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-neuro-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-neuro-green" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-light-text dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}

                    {plan.limitations && plan.limitations.map((limitation, index) => (
                      <div key={`lim-${index}`} className="flex items-start gap-3 opacity-50">
                        <svg className="w-5 h-5 text-light-text-secondary dark:text-gray-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-sm text-light-text-secondary dark:text-gray-500">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${plan.highlighted
                      ? 'bg-gradient-to-r from-neuro-green to-neuro-green-dark hover:from-neuro-green-light hover:to-neuro-green shadow-lg shadow-neuro-green/20 hover:shadow-neuro-green/40'
                      : 'bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20'
                      }`}
                    onClick={() => handleSelectPlan(plan.role)}
                    disabled={isCurrent || isDowngrade}
                  >
                    {isCurrent ? 'Plano Atual' : isDowngrade ? 'Indisponível' : 'Selecionar Plano'}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* seção de perguntas frequentes */}
          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-light-border dark:border-white/10 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-light-text dark:text-white mb-8 text-center">
              Perguntas Frequentes
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: "Posso cancelar a qualquer momento?", a: "Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento." },
                { q: "Posso fazer upgrade depois?", a: "Sim, você pode fazer upgrade a qualquer momento. O valor será ajustado proporcionalmente." },
                { q: "Como funcionam as consultorias?", a: "As consultorias são sessões individuais online com especialistas. Você agenda diretamente pela plataforma." }
              ].map((item, idx) => (
                <details key={idx} className="group bg-white/40 dark:bg-white/5 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
                    <span className="font-medium text-light-text dark:text-white">
                      {item.q}
                    </span>
                    <svg className="w-5 h-5 text-light-text-secondary dark:text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="p-4 pt-0 text-sm text-light-text-secondary dark:text-gray-400 leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
