import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { fetchAdminActivity } from "../../../services/adminProfileApi";
import { useLanguage } from "../../../hooks/useLanguage";

export default function ActivityLogTab({ isDark = true }) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [activities, setActivities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const loadActivities = async (page = 1, filterType = filter) => {
    setIsLoading(true);
    try {
      const res = await fetchAdminActivity({ page, limit: 15, filter: filterType });
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
    loadActivities(1, filter);
  }, [filter]);

  const handleFilterChange = (type) => {
    setFilter(type);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadActivities(newPage, filter);
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
      className={`rounded-2xl border p-6 space-y-5 animate-in fade-in duration-150 ${
        isDark
          ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white shadow-lg"
          : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}
    >
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {isEn ? "Audit Activity Logs" : "Nhật ký thao tác quản trị"}
          </h3>
          <p className="text-xs sm:text-sm text-cyan-200/70 mt-0.5">
            {isEn
              ? `${pagination.total} administrative actions recorded`
              : `${pagination.total} thao tác quản trị được ghi nhận`}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
          {[
            { id: "all", label: isEn ? "All" : "Tất cả" },
            { id: "create", label: isEn ? "Create" : "Tạo mới" },
            { id: "update", label: isEn ? "Update" : "Cập nhật" },
            { id: "delete", label: isEn ? "Delete" : "Xóa" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                filter === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => loadActivities(pagination.page, filter)}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
            title={isEn ? "Refresh" : "Làm mới"}
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin text-cyan-400" : ""} />
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="overflow-x-auto rounded-xl border border-white/15">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[#1e2f5c] text-white/80 font-semibold border-b border-white/15">
              <th className="py-3 px-4">{isEn ? "Timestamp" : "Thời gian"}</th>
              <th className="py-3 px-4">{isEn ? "Admin" : "Người thực hiện"}</th>
              <th className="py-3 px-4">{isEn ? "Action" : "Hành động"}</th>
              <th className="py-3 px-4">{isEn ? "Target" : "Đối tượng"}</th>
              <th className="py-3 px-4">{isEn ? "Details" : "Chi tiết"}</th>
              <th className="py-3 px-4 text-center">{isEn ? "Status" : "Trạng thái"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-white/60">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-cyan-400" />
                    <span>{isEn ? "Loading logs..." : "Đang tải dữ liệu..."}</span>
                  </div>
                </td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-white/60">
                  <p className="text-sm font-medium">
                    {isEn ? "No activity logs recorded yet." : "Chưa có thao tác quản trị nào được ghi nhận."}
                  </p>
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
                    <td className="py-3 px-4 text-white/60 font-mono text-xs whitespace-nowrap">
                      {formatDateTime(act.timestamp)}
                    </td>
                    <td className="py-3 px-4 text-white font-medium whitespace-nowrap">
                      {act.adminName || act.user?.username || "Admin"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-cyan-300 font-medium whitespace-nowrap">
                      {act.target || "-"}
                    </td>
                    <td className="py-3 px-4 text-white/80 max-w-xs truncate" title={act.details}>
                      {act.details || "-"}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
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
