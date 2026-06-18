'use client';

import { useState } from 'react';
import Toast from '@/components/Toast';

/**
 * Toast Component Examples
 * Shows different toast types, positions, and animations
 */

export function ToastExamples() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Toast Notifications</h1>

      {/* Toast Display Area */}
      <div className="fixed bottom-4 right-4 z-50 space-y-3 flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={4000}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Demo Buttons */}
      <div className="space-y-6">
        <section className="p-6 bg-bg-secondary rounded-lg border border-border-primary">
          <h2 className="text-xl font-semibold mb-4">Success Messages</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => addToast('Operation completed successfully!', 'success')}
              className="px-4 py-2 bg-success text-white rounded-lg hover:opacity-90"
            >
              Show Success
            </button>
            <button
              onClick={() => addToast('Profile updated successfully', 'success')}
              className="px-4 py-2 bg-success text-white rounded-lg hover:opacity-90"
            >
              Profile Updated
            </button>
          </div>
        </section>

        <section className="p-6 bg-bg-secondary rounded-lg border border-border-primary">
          <h2 className="text-xl font-semibold mb-4">Error Messages</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => addToast('Something went wrong. Please try again.', 'error')}
              className="px-4 py-2 bg-error text-white rounded-lg hover:opacity-90"
            >
              Show Error
            </button>
            <button
              onClick={() => addToast('Invalid email or password', 'error')}
              className="px-4 py-2 bg-error text-white rounded-lg hover:opacity-90"
            >
              Login Failed
            </button>
          </div>
        </section>

        <section className="p-6 bg-bg-secondary rounded-lg border border-border-primary">
          <h2 className="text-xl font-semibold mb-4">Warning Messages</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => addToast('Are you sure you want to delete this?', 'warning')}
              className="px-4 py-2 bg-warning text-black rounded-lg hover:opacity-90"
            >
              Show Warning
            </button>
            <button
              onClick={() => addToast('This action cannot be undone', 'warning')}
              className="px-4 py-2 bg-warning text-black rounded-lg hover:opacity-90"
            >
              Irreversible Action
            </button>
          </div>
        </section>

        <section className="p-6 bg-bg-secondary rounded-lg border border-border-primary">
          <h2 className="text-xl font-semibold mb-4">Info Messages</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => addToast('New update available. Refresh to get the latest version.', 'info')}
              className="px-4 py-2 bg-info text-white rounded-lg hover:opacity-90"
            >
              Show Info
            </button>
            <button
              onClick={() => addToast('You have 3 unread messages', 'info')}
              className="px-4 py-2 bg-info text-white rounded-lg hover:opacity-90"
            >
              New Messages
            </button>
          </div>
        </section>

        <section className="p-6 bg-bg-secondary rounded-lg border border-border-primary">
          <h2 className="text-xl font-semibold mb-4">Multiple Toasts</h2>
          <button
            onClick={() => {
              addToast('Success message', 'success');
              setTimeout(() => addToast('Warning message', 'warning'), 500);
              setTimeout(() => addToast('Error message', 'error'), 1000);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
          >
            Stack Multiple
          </button>
        </section>
      </div>
    </div>
  );
}

export default ToastExamples;
