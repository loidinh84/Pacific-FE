import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  KeyRound,
  Layers,
  Fish,
  MapPin,
  Users,
  Settings,
  Info,
} from "lucide-react";

export default function PermissionsTab({
  permissionsList = [],
  role = "admin",
  isDark = true,
}) {
  const getModuleIcon = (moduleName) => {
    if (moduleName.includes("Sinh vật")) return Fish;
    if (moduleName.includes("Nhóm")) return Layers;
    if (moduleName.includes("Địa điểm")) return MapPin;
    if (moduleName.includes("Người dùng")) return Users;
    return Settings;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Role Banner */}
      <div
        className={`rounded-3xl border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isDark
            ? "bg-gradient-to-r from-blue-950/60 via-[#142247] to-cyan-950/60 border-cyan-500/30 text-white shadow-xl"
            : "bg-blue-50 border-blue-200 text-slate-900 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                Vai trò quản trị:{" "}
                <span className="text-cyan-400 uppercase tracking-wider">
                  {role === "super_admin" ? "Super Admin (Toàn quyền)" : "Admin (Quản trị vận hành)"}
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Ma trận phân quyền xác định các chức năng và dữ liệu bạn được phép truy cập trên hệ sinh thái Pacific.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
          <Info size={13} />
          <span>Quyền hạn tự động</span>
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {permissionsList.map((mod, idx) => {
          const Icon = getModuleIcon(mod.module);
          return (
            <div
              key={idx}
              className={`rounded-3xl border p-5 sm:p-6 space-y-4 ${
                isDark
                  ? "bg-[#142247]/90 border-cyan-500/20 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-900 shadow-sm"
              }`}
            >
              {/* Module Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">{mod.module}</h4>
                  <p className="text-[11px] text-slate-400">{mod.description}</p>
                </div>
              </div>

              {/* Permissions List */}
              <div className="space-y-2">
                {mod.permissions.map((perm, pIdx) => (
                  <div
                    key={pIdx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="space-y-0.5 pr-2">
                      <p className="text-xs font-semibold text-slate-200">{perm.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{perm.code}</p>
                    </div>

                    {perm.granted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                        <CheckCircle2 size={12} />
                        <span>Được phép</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                        <XCircle size={12} />
                        <span>Giới hạn</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
