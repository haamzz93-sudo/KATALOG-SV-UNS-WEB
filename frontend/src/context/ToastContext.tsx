"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastMethods {
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

export interface ToastContextType extends ToastMethods {
  toast: ToastMethods;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string, duration: number = 3800) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastItem = { id, type, title, message, duration };

    setToasts((prev) => [...prev.slice(-3), newToast]); // Keep max 4 visible at once

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message?: string, duration?: number) => {
    addToast("success", title, message, duration);
  }, [addToast]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    addToast("error", title, message, duration);
  }, [addToast]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    addToast("info", title, message, duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, info, toast: { success, error, info } }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4">
        <AnimatePresence>
          {toasts.map((t) => {
            const isSuccess = t.type === "success";
            const isError = t.type === "error";

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3.5 relative overflow-hidden ${
                  isSuccess
                    ? "bg-[#07192C]/95 dark:bg-[#07192C]/95 text-white border-emerald-500/50 shadow-[0_10px_30px_rgba(16,185,129,0.25)]"
                    : isError
                    ? "bg-[#07192C]/95 dark:bg-[#07192C]/95 text-white border-rose-500/50 shadow-[0_10px_30px_rgba(244,63,94,0.25)]"
                    : "bg-[#07192C]/95 dark:bg-[#07192C]/95 text-white border-[#C5A059]/50 shadow-[0_10px_30px_rgba(197,160,89,0.25)]"
                }`}
              >
                {/* Glowing Side Accent Line */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isSuccess ? "bg-emerald-400" : isError ? "bg-rose-400" : "bg-[#C5A059]"
                  }`}
                />

                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    isSuccess
                      ? "bg-emerald-500/20 text-emerald-400"
                      : isError
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-[#C5A059]/20 text-[#C5A059]"
                  }`}
                >
                  {isSuccess && <CheckCircle2 className="w-5 h-5" />}
                  {isError && <AlertTriangle className="w-5 h-5" />}
                  {!isSuccess && !isError && <Info className="w-5 h-5" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-2 text-left">
                  <h5 className="font-extrabold text-sm tracking-tight text-white">{t.title}</h5>
                  {t.message && (
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-medium">
                      {t.message}
                    </p>
                  )}
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
