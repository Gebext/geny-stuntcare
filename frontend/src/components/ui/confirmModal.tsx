"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  icon: LucideIcon;
  variant?: "teal" | "rose" | "blue";
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  description,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  icon: Icon,
  variant = "teal",
}: ConfirmModalProps) => {
  const colors = {
    teal: "bg-teal-50 text-[#3AC4B6] border-teal-100 shadow-teal-100",
    rose: "bg-rose-50 text-rose-500 border-rose-100 shadow-rose-100",
    blue: "bg-blue-50 text-blue-500 border-blue-100 shadow-blue-100",
  };

  const btnColors = {
    teal: "bg-[#3AC4B6]",
    rose: "bg-rose-500",
    blue: "bg-blue-500",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl border border-slate-50"
          >
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border",
                colors[variant],
              )}
            >
              <Icon className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-slate-800 uppercase leading-tight mb-2 tracking-tight">
              {title}
            </h3>

            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-8 px-4 leading-relaxed">
              {description}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  "py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-white shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95",
                  btnColors[variant],
                  variant === "teal" && "shadow-teal-100",
                  variant === "rose" && "shadow-rose-100",
                  variant === "blue" && "shadow-blue-100",
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
