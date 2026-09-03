import { useMemo } from "react";
import { Check, X } from "lucide-react";

export default function PasswordStrengthIndicator({ password = "" }) {
  const analysis = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score = 0;
    if (hasMinLength) score += 1;
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    let label = "Yếu";
    let colorClass = "bg-rose-500 text-rose-400";
    let barWidth = "20%";

    if (!password) {
      label = "Chưa nhập";
      colorClass = "bg-slate-600 text-slate-400";
      barWidth = "0%";
    } else if (score <= 2) {
      label = "Yếu";
      colorClass = "bg-rose-500 text-rose-400";
      barWidth = "30%";
    } else if (score <= 4) {
      label = "Trung bình";
      colorClass = "bg-amber-500 text-amber-400";
      barWidth = "65%";
    } else {
      label = "Rất mạnh";
      colorClass = "bg-emerald-500 text-emerald-400";
      barWidth = "100%";
    }

    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial,
      score,
      label,
      colorClass,
      barWidth,
    };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2 p-3 rounded-2xl bg-white/[0.02] border border-white/10 animate-in fade-in duration-150">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Độ bảo mật mật khẩu:</span>
        <span className={`font-bold ${analysis.colorClass.split(" ")[1]}`}>
          {analysis.label}
        </span>
      </div>

      {/* Strength Bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${analysis.colorClass.split(" ")[0]}`}
          style={{ width: analysis.barWidth }}
        />
      </div>

      {/* Rules checklist */}
      <div className="grid grid-cols-2 gap-1 pt-1 text-[11px]">
        <div className={`flex items-center gap-1.5 ${analysis.hasMinLength ? "text-emerald-400" : "text-slate-400"}`}>
          {analysis.hasMinLength ? <Check size={12} /> : <X size={12} />}
          <span>Ít nhất 8 ký tự</span>
        </div>
        <div className={`flex items-center gap-1.5 ${analysis.hasUppercase ? "text-emerald-400" : "text-slate-400"}`}>
          {analysis.hasUppercase ? <Check size={12} /> : <X size={12} />}
          <span>Chữ cái in hoa (A-Z)</span>
        </div>
        <div className={`flex items-center gap-1.5 ${analysis.hasLowercase ? "text-emerald-400" : "text-slate-400"}`}>
          {analysis.hasLowercase ? <Check size={12} /> : <X size={12} />}
          <span>Chữ cái thường (a-z)</span>
        </div>
        <div className={`flex items-center gap-1.5 ${analysis.hasNumber ? "text-emerald-400" : "text-slate-400"}`}>
          {analysis.hasNumber ? <Check size={12} /> : <X size={12} />}
          <span>Chữ số (0-9)</span>
        </div>
      </div>
    </div>
  );
}
