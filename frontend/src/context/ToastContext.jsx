import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ message, type });
    timeoutRef.current = setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`local-toast ${toast.type === 'error' ? 'error' : ''}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
