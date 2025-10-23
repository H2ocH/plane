import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Toast as ToastType } from '../../types';

interface ToastContextType {
  toast: (options: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const toast = useCallback((options: ToastType) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(t => [...t, { ...options, id }]);
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const value = { toast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} />
    </ToastContext.Provider>
  );
};


interface ToasterProps {
  toasts: ToastType[];
}

const Toaster: React.FC<ToasterProps> = ({ toasts }) => {
  return (
    <div 
      aria-live="assertive" 
      aria-atomic="true"
      className="fixed bottom-0 right-0 p-4 sm:p-6 space-y-2 w-full max-w-sm z-[100]"
    >
      {toasts.map(({ id, title, description, variant, action }) => (
        <div 
          key={id} 
          className={`
            animate-toast-slide-in relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg p-4 pr-8 shadow-lg transition-all 
            ${variant === 'destructive' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}
          `}
        >
          <div className="grid gap-1">
            <div className="font-semibold">{title}</div>
            {description && <div className="text-sm opacity-90">{description}</div>}
            {action && (
              <button 
                onClick={action.onClick}
                className="mt-2 text-sm font-semibold underline"
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
