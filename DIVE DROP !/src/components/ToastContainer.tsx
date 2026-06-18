'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Toast, { ToastProps, ToastPosition } from './Toast';

interface ToastWithPosition extends ToastProps {
  position: ToastPosition;
}

interface ToastContainerProps {
  position?: ToastPosition;
  maxToasts?: number;
}

const ToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  ({ position = 'bottom-right', maxToasts = 3 }, ref) => {
    const [toasts, setToasts] = useState<ToastWithPosition[]>([]);
    const toastIdRef = useRef(0);

    const addToast = useCallback(
      (
        message: string,
        type: 'success' | 'error' | 'warning' | 'info' = 'info',
        options?: {
          duration?: number;
          action?: {
            label: string;
            onClick: () => void;
          };
        }
      ) => {
        const id = `toast-${toastIdRef.current++}`;

        const toast: ToastWithPosition = {
          id,
          message,
          type,
          duration: options?.duration ?? 4000,
          position,
          action: options?.action,
          onClose: () => removeToast(id),
        };

        setToasts((prev) => {
          let updated = [...prev, toast];
          // Keep only the latest maxToasts
          if (updated.length > maxToasts) {
            updated = updated.slice(-maxToasts);
          }
          return updated;
        });

        return id;
      },
      [position, maxToasts]
    );

    const removeToast = useCallback((id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const getPositionStyles = () => {
      const baseClasses = 'fixed pointer-events-none z-[9999]';
      const positionMap = {
        'top-left': 'top-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
      };
      return `${baseClasses} ${positionMap[position]}`;
    };

    const flexDirection =
      position.includes('top') && position.includes('center')
        ? 'flex-col-reverse'
        : position.includes('top')
          ? 'flex-col-reverse'
          : 'flex-col';

    return (
      <div
        ref={ref}
        className={`${getPositionStyles()} flex ${flexDirection} gap-3 pointer-events-auto`}
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} />
          </div>
        ))}
      </div>
    );
  }
);

ToastContainer.displayName = 'ToastContainer';

// Context for easy access
interface ToastContextType {
  addToast: (
    message: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    options?: {
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => string;
  removeToast: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const addToast = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'warning' | 'info' = 'info',
      options?: {
        duration?: number;
        action?: {
          label: string;
          onClick: () => void;
        };
      }
    ) => {
      // This is a placeholder - actual implementation handled by ToastContainer
      return '';
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    // This is a placeholder - actual implementation handled by ToastContainer
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer ref={containerRef} position="bottom-right" maxToasts={3} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export default ToastContainer;
