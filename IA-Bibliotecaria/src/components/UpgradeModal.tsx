import { UserRole } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  targetRole?: UserRole;
  onUpgrade: (role: UserRole) => void;
}

const planDetails: Record<UserRole, { name: string; price: string; features: string[] }> = {
  free: {
    name: 'Presença Aberta',
    price: 'Gratuito',
    features: ['Acesso básico', 'Conteúdos limitados', 'IA Conversacional básica'],
  },
  intermediario: {
    name: 'Círculo Implicado',
    price: 'R$ 97/mês',
    features: [
      'Todos os conteúdos intermediários',
      'Consultorias limitadas',
      'IA Guardiã parcial',
      'Exercícios de autopercepção',
      'Suporte prioritário',
    ],
  },
  full: {
    name: 'Círculo Integral',
    price: 'R$ 297/mês',
    features: [
      'Acesso total a todos os conteúdos',
      'Consultorias ilimitadas',
      'IA Guardiã completa',
      'Acompanhamento estatístico avançado',
      'Exercícios evolutivos completos',
      'Suporte VIP',
      'Comunidade exclusiva',
    ],
  },
};

export default function UpgradeModal({ 
  isOpen, 
  onClose, 
  currentRole, 
  targetRole,
  onUpgrade 
}: UpgradeModalProps) {
  const availablePlans: UserRole[] = 
    currentRole === 'free' ? ['intermediario', 'full'] :
    currentRole === 'intermediario' ? ['full'] : [];

  const selectedPlan = targetRole || availablePlans[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neuro-blue/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-neuro-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
          Expanda sua Jornada
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Desbloqueie todo o potencial da plataforma NEUROCOM
        </p>
      </div>

      {/* Plans */}
      <div className="space-y-4 mb-6">
        {availablePlans.map((role) => {
          const plan = planDetails[role];
          const isSelected = role === selectedPlan;

          return (
            <div
              key={role}
              className={`p-5 rounded-neuro border-2 transition-all ${
                isSelected
                  ? 'border-neuro-blue bg-neuro-blue/5'
                  : 'border-light-border dark:border-dark-border hover:border-neuro-blue/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                    {plan.name}
                  </h3>
                  <p className="text-2xl font-bold text-neuro-blue">
                    {plan.price}
                  </p>
                </div>
                {role === 'full' && (
                  <span className="badge badge-secondary">Recomendado</span>
                )}
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-neuro-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-light-text dark:text-dark-text">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={isSelected ? 'primary' : 'secondary'}
                onClick={() => onUpgrade(role)}
                className="w-full mt-4"
              >
                {isSelected ? 'Selecionar Plano' : 'Ver Plano'}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-light-border dark:border-dark-border">
        <p className="text-xs text-center text-light-text-secondary dark:text-dark-text-secondary">
          Pagamento seguro • Cancele quando quiser • Garantia de 7 dias
        </p>
      </div>
    </Modal>
  );
}
