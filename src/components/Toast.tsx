import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#2D2D2A] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between gap-3 text-xs sm:text-sm animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#5B6D5B] shrink-0" />
            <p className="font-medium text-stone-100">{toast.text}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-md text-stone-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
