import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<ToastProps> = ({ id, type, message, onDismiss }) => {
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borderMap = {
    success: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-200',
    warning: 'border-amber-500/30 bg-amber-950/40 text-amber-200',
    error: 'border-red-500/30 bg-red-950/40 text-red-200',
    info: 'border-cyan-500/30 bg-cyan-950/40 text-cyan-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg ${borderMap[type]}`}
    >
      {iconMap[type]}
      <p className="text-sm font-medium pr-2">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="opacity-70 hover:opacity-100 transition-opacity ml-auto"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default NotificationToast;
