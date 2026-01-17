import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, hover = false, className = '', onClick }: CardProps) {
  const hoverClass = hover ? 'card-hover cursor-pointer' : 'card';
  
  return (
    <div className={`${hoverClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
