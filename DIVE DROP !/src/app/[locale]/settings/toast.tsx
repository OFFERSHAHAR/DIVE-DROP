'use client';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export default function Toast({ message, type = 'success' }: ToastProps) {
  const bgColor = {
    success: 'bg-success',
    error: 'bg-error',
    info: 'bg-color-info',
    warning: 'bg-color-warning',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-slide-up">
      <div
        className={`${bgColor} text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-3 max-w-sm`}
      >
        <span className="text-lg font-bold">{icon}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
