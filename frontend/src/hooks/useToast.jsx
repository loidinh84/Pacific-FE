import { useState, useCallback } from "react";

/**
 * Custom hook for managing toast notifications.
 * Usage:
 *   const { toasts, showToast, removeToast } = useToast();
 *   showToast("Saved!", "success");
 *   showToast("Failed!", "error");
 *
 * Pair with <ToastContainer> from "./ToastContainer"
 */
export function useToast(duration = 3500) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), duration);
    },
    [duration, removeToast]
  );

  return { toasts, showToast, removeToast };
}

