import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X, Undo2 } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-cute-lg border animate-pop flex items-start gap-3 transition-all ${
              isError
                ? 'border-rose-200 text-rose-900 ring-2 ring-rose-300/30'
                : isSuccess
                ? 'border-berry-200 text-gray-900 ring-2 ring-berry-300/20'
                : 'border-blue-200 text-gray-900'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isError ? (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-berry-500" />
              ) : (
                <Info className="w-5 h-5 text-blue-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-xs">{toast.title}</h5>
              <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                {toast.message}
              </p>

              {toast.undoAction && (
                <button
                  onClick={() => {
                    toast.undoAction?.();
                    removeToast(toast.id);
                  }}
                  className="mt-2 text-[11px] font-bold text-berry-600 hover:text-berry-800 flex items-center gap-1 bg-berry-50 px-2.5 py-1 rounded-lg border border-berry-200 transition-colors"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Undo removal</span>
                </button>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
