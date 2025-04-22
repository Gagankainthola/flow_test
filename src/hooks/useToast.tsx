import { useCallback } from "react";

type ToastType = "success" | "error" | "info";

type ToastOptions = {
  title: string;
  description: string;
  type: ToastType;
};

type ToastCallback = (toast: ToastOptions) => void;

// Simple event system for toasts
const listeners: ToastCallback[] = [];

const subscribe = (callback: ToastCallback) => {
  listeners.push(callback);
};

const unsubscribe = (callback: ToastCallback) => {
  const index = listeners.indexOf(callback);
  if (index > -1) {
    listeners.splice(index, 1);
  }
};

const emit = (toast: ToastOptions) => {
  listeners.forEach((listener) => listener(toast));
};

// Toast function that components can import
export const toast = {
  success: (title: string, description: string) => {
    emit({ title, description, type: "success" });
  },
  error: (title: string, description: string) => {
    emit({ title, description, type: "error" });
  },
  info: (title: string, description: string) => {
    emit({ title, description, type: "info" });
  },
  // Custom toast with options
  custom: (options: ToastOptions) => {
    emit(options);
  },
  subscribe,
  unsubscribe,
};

// Hook for components to use
export const useToast = () => {
  const showToast = useCallback((options: ToastOptions) => {
    emit(options);
  }, []);

  return { toast: showToast };
};
