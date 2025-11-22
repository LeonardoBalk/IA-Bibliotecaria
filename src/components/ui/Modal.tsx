import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl animate-slide-up">
        <div className="bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-md border border-light-border dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-white/5">
              <h2 className="text-xl font-semibold text-light-text dark:text-white tracking-tight">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-light-text-secondary dark:text-gray-400 hover:text-light-text dark:hover:text-white transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
