import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  error: <AlertCircle className="w-4 h-4 text-red-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  info: <Info className="w-4 h-4 text-blue-500" />,
};

const BG_COLORS: Record<ToastType, string> = {
  success: 'rgba(34, 197, 94, 0.08)',
  error: 'rgba(239, 68, 68, 0.08)',
  warning: 'rgba(245, 158, 11, 0.08)',
  info: 'rgba(59, 130, 246, 0.08)',
};

// Simple global toast store
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toastList: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach((fn) => fn([...toastList]));
}

export function showToast(message: string, type: ToastType = 'info', duration: number = 4000) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  toastList.push({ id, message, type, duration });
  notifyListeners();

  if (duration > 0) {
    setTimeout(() => {
      toastList = toastList.filter((t) => t.id !== id);
      notifyListeners();
    }, duration);
  }
}

export function dismissToast(id: string) {
  toastList = toastList.filter((t) => t.id !== id);
  notifyListeners();
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (updated: Toast[]) => setToasts(updated);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg border border-gray-200/40"
            style={{ backgroundColor: BG_COLORS[toast.type] }}
          >
            {ICONS[toast.type]}
            <span className="text-[13px] font-medium text-[var(--color-text-primary)] flex-1">
              {toast.message}
            </span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-0.5 rounded-md hover:bg-black/5 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for components that need toast
export function useToast() {
  return useCallback((message: string, type: ToastType = 'info') => {
    showToast(message, type);
  }, []);
}
