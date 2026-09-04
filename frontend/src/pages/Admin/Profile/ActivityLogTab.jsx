import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { fetchAdminActivity } from "../../../services/adminProfileApi";
import { useLanguage } from "../../../hooks/useLanguage";

export default function ActivityLogTab({ isDark = true }) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [activities, setActivities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);

  const loadActivities = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await fetchAdminActivity({ page, limit: 15, filter: "all" });
      if (res.success) {
        setActivities(res.activities || []);
        setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử hoạt động:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadActivities(newPage);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return isEn ? `${year}-${month}-${day} ${hours}:${minutes}` : `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return dateStr;
    }
  };

  const getActionBadge = (action) => {
    const act = (action || "").toUpperCase();
    if (act.includes("CREATE") || act.includes("ADD")) {
      return {
        label: isEn ? "CREATE" : "TẠO MỚI",
        className: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      };
    }
    if (act.includes("UPDATE") || act.includes("EDIT") || act.includes("CHANGE")) {
      return {
        label: isEn ? "UPDATE" : "CẬP NHẬT",
        className: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
      };
    }
    if (act.includes("DELETE") || act.includes("REMOVE")) {
      return {
        label: isEn ? "DELETE" : "XÓA",
        className: "bg-rose-500/20 text-rose-400 border border-rose-500/40",
      };
    }
    return {
      label: act,
      className: "bg-white/10 text-white/80 border border-white/15",
    };
  };

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-8 space-y-6 animate-in fade-in duration-150 relative z-10 ${
        isDark
          ? "bg-[#0d1a38]/92 backdrop-blur-md border-white/20 text-white shadow-sm"
          : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isEn ? "Activity History" : "Lịch sử thao tác"}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/90 border border-white/20">
              {isEn ? "Read-only" : "Chỉ xem"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-cyan-200/90 mt-1">
            {isEn
              ? `${pagination.total} administrative actions recorded (automatic log)`
              : `${pagination.total} thao tác quản trị được hệ thống tự động ghi nhận`}
          </p>
        </div>

        {/* Refresh Action Button */}
        <button
          type="button"
          onClick={() => loadActivities(pagination.page)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-sm backdrop-blur-md transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin text-cyan-300" : ""} />
          <span>{isEn ? "Refresh" : "Làm mới"}</span>
        </button>
      </div>

      {/* Audit Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/20">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[#081228] text-white font-bold border-b border-white/20">
              <th className="py-3.5 px-4">{isEn ? "Timestamp" : "Thời gian"}</th>
              <th className="py-3.5 px-4">{isEn ? "Admin" : "Người thực hiện"}</th>
              <th className="py-3.5 px-4">{isEn ? "Action" : "Hành động"}</th>
              <th className="py-3.5 px-4">{isEn ? "Target" : "Đối tượng"}</th>
              <th className="py-3.5 px-4">{isEn ? "Details" : "Chi tiết thao tác"}</th>
              <th className="py-3.5 px-4 text-center">{isEn ? "Status" : "Trạng thái"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-[#081228]/50">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-white/60">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin text-cyan-400" />
                    <span>{isEn ? "Loading logs..." : "Đang tải dữ liệu lịch sử..."}</span>
                  </div>
                </td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-white/60">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldCheck size={32} className="text-white/30" />
                    <p className="text-sm font-medium">
                      {isEn ? "No activity logs recorded yet." : "Chưa có thao tác quản trị nào được ghi nhận."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              activities.map((act, index) => {
                const badge = getActionBadge(act.action);
                return (
                  <tr
                    key={act.id || index}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-white/60 font-mono text-xs whitespace-nowrap">
                      {formatDateTime(act.timestamp)}
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium whitespace-nowrap">
                      {act.adminName || act.user?.username || "Admin"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-cyan-300 font-medium whitespace-nowrap">
                      {act.target || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-white/85 max-w-sm truncate" title={act.details}>
                      {act.details || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="text-xs font-medium text-emerald-400">
                        {isEn ? "Success" : "Thành công"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-sm text-white/70">
          <span>
            {isEn
              ? `Page ${pagination.page} of ${pagination.totalPages}`
              : `Trang ${pagination.page} / ${pagination.totalPages}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="p-2 rounded-lg border border-white/15 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || isLoading}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="p-2 rounded-lg border border-white/15 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
