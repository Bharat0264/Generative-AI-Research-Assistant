import { createContext, useContext, useMemo, useState } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const value = useMemo(
    () => ({
      notify(message, type = 'success') {
        const id = crypto.randomUUID();
        setToasts((items) => [...items, { id, message, type }]);
        window.setTimeout(() => {
          setToasts((items) => items.filter((toast) => toast.id !== id));
        }, 4200);
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex min-w-72 items-start gap-3 rounded-md px-4 py-3 text-sm shadow-soft ${
              toast.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-ink text-white dark:bg-white dark:text-ink'
            }`}
          >
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToasts((items) => items.filter((item) => item.id !== toast.id))}>
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
