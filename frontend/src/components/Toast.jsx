import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

// 1. Context Creation
const ToastContext = createContext(null);

// 2. Provider Component
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success", duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

// 3. Custom Hook
export const useToast = () => useContext(ToastContext);

// 4. Individual Toast Component
const ToastItem = ({ toast, onRemove }) => {
    const { type, message } = toast;

    const baseStyles = "flex items-center gap-3 p-4 rounded-xl shadow-lg border-l-4 min-w-[300px] animate-slide-in-right";

    const typeStyles = {
        success: "bg-white border-harvest text-forest",
        warning: "bg-white border-olive text-forest",
        error: "bg-white border-rust text-rust font-semibold",
    };

    const icons = {
        success: <CheckCircle className="w-6 h-6 text-harvest" />,
        warning: <AlertTriangle className="w-6 h-6 text-olive" />,
        error: <XCircle className="w-6 h-6 text-rust" />,
    };

    return (
        <div className={`${baseStyles} ${typeStyles[type] || typeStyles.success}`}>
            {icons[type]}
            <p className="flex-1 font-body">{message}</p>
            <button onClick={onRemove} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default ToastProvider;
