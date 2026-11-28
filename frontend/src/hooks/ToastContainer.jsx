import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const TOAST_STYLES = {
  success: {
    wrapper: "bg-white/95 border-emerald-500/35 text-emerald-900",
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
  },
  error: {
    wrapper: "bg-white/95 border-rose-500/35 text-rose-900",
    icon: AlertCircle,
    iconClass: "text-rose-600",
  },
  warning: {
    wrapper: "bg-white/95 border-amber-500/35 text-amber-900",
    icon: AlertTriangle,
    iconClass: "text-amber-600",
  },
  info: {
    wrapper: "bg-white/95 border-sky-500/35 text-sky-900",
    icon: Info,
    iconClass: "text-[#0284c7]",
  },
};

/**
 * Renders all active toast notifications.
 * Place this once at the top level of a page.
 * Use together with the useToast hook.
 */
export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100vw-2rem)] max-w-md flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => {
        const style = TOAST_STYLES[t.type] || TOAST_STYLES.info;
        const Icon = style.icon;
        return (
          <div
            key={t.id}
            className={`max-w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border backdrop-blur-xl text-xs sm:text-sm font-medium shadow-lg pointer-events-auto animate-in fade-in slide-in-from-bottom-3 duration-300 ${style.wrapper}`}
          >
            <Icon size={16} className={`shrink-0 ${style.iconClass}`} />
            <span>{t.message}</span>
            <button
              onClick={() => onRemove(t.id)}
              className="ml-1 opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
