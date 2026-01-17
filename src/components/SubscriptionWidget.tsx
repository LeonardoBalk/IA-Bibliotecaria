import { UserRole } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';

interface SubscriptionWidgetProps {
  userRole: UserRole;
  onUpgrade: () => void;
}

const planNames: Record<UserRole, string> = {
  free: 'Presença Aberta',
  intermediario: 'Círculo Implicado',
  full: 'Círculo Integral',
};

const planFeatures: Record<UserRole, string[]> = {
  free: ['Acesso básico', 'Conteúdos limitados', 'IA Conversacional básica'],
  intermediario: ['Mais conteúdos', 'Consultorias limitadas', 'IA Guardiã parcial'],
  full: ['Acesso total', 'Consultorias ilimitadas', 'IA Guardiã completa'],
};

export default function SubscriptionWidget({ userRole, onUpgrade }: SubscriptionWidgetProps) {
  const progress = userRole === 'free' ? 33 : userRole === 'intermediario' ? 66 : 100;
  const canUpgrade = userRole !== 'full';

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
            Plano Atual
          </p>
          <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
            {planNames[userRole]}
          </h3>
        </div>
        <Badge variant={userRole === 'full' ? 'secondary' : 'primary'}>
          {userRole.toUpperCase()}
        </Badge>
      </div>

      <ProgressBar value={progress} label="Nível de acesso" showPercentage />

      <div className="mt-4 space-y-2">
        {planFeatures[userRole].map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-neuro-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-light-text-secondary dark:text-dark-text-secondary">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {canUpgrade && (
        <div className="mt-6 pt-6 border-t border-light-border dark:border-dark-border">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3">
            Desbloqueie todo o potencial da plataforma
          </p>
          <Button variant="primary" onClick={onUpgrade} className="w-full">
            Fazer Upgrade
          </Button>
        </div>
      )}
    </Card>
  );
}
