import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative z-10 w-full ${sizeClasses[size]}`}>
        <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-3xl shadow-xl overflow-hidden">
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-light-border dark:border-dark-border">
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors p-1 rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className={title ? '' : 'p-6'}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
