import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const TOAST_STYLES = {
  success: {
    wrapper: "bg-emerald-500/15 border-emerald-500/40 text-emerald-200",
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
  },
  error: {
    wrapper: "bg-rose-500/15 border-rose-500/40 text-rose-200",
    icon: AlertCircle,
    iconClass: "text-rose-400",
  },
  warning: {
    wrapper: "bg-amber-500/15 border-amber-500/40 text-amber-200",
    icon: AlertTriangle,
    iconClass: "text-amber-400",
  },
  info: {
    wrapper: "bg-sky-500/15 border-sky-500/40 text-sky-200",
    icon: Info,
    iconClass: "text-sky-400",
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
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => {
        const style = TOAST_STYLES[t.type] || TOAST_STYLES.info;
        const Icon = style.icon;
        return (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border backdrop-blur-xl text-sm font-semibold shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-bottom-3 duration-300 ${style.wrapper}`}
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
