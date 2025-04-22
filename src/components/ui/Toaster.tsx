import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { toast } from "../../hooks/useToast";

type Toast = {
  id: string;
  title: string;
  description: string;
  type: "success" | "error" | "info";
};

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (newToast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prevToasts) => [...prevToasts, { ...newToast, id }]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, 5000);
    };

    toast.subscribe(handleToast);

    return () => {
      toast.unsubscribe(handleToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-success-500" size={20} />;
      case "error":
        return <AlertCircle className="text-error-500" size={20} />;
      case "info":
        return <Info className="text-primary-500" size={20} />;
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 flex items-start gap-3 animate-fade-in"
          role="alert"
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {toast.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {toast.description}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
