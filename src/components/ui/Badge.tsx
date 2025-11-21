import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'neutral';
  className?: string;
}

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const variants = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    neutral: 'badge-neutral',
  };

  return <span className={`${variants[variant]} ${className}`}>{children}</span>;
}
