'use client';

import { Button } from '@/components/Button';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isLoading?: boolean;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmText,
  cancelText,
  isLoading = false,
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-bg-primary rounded-lg shadow-lg max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-secondary">
          <h3 className="h4 text-text-primary">{title}</h3>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-text-secondary text-body">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-secondary bg-bg-secondary flex gap-3 justify-end">
          <Button
            variant="ghost"
            size="md"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            loading={isLoading}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
