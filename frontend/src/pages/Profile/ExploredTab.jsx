import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, MapPin, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchMyExplored } from "../../services/userService";

export default function ExploredTab() {
  const [explored, setExplored] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExplored = async (page = 1) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetchMyExplored({ page, limit: 12 });
      if (res.success) {
        setExplored(res.data || []);
        setPagination(res.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách địa điểm khám phá:", err);
      setError("Không thể tải danh sách địa điểm đã khám phá!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExplored(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2.5">
          <MapPin size={22} className="text-pacific-cyan" />
          <span>Địa điểm đã khám phá ({pagination.total})</span>
        </h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#1b254b]/50 border border-white/10 rounded-3xl">
          <Loader2 size={32} className="text-pacific-cyan animate-spin mb-3" />
          <p className="text-xs text-white/60">Đang tải nhật ký thám hiểm đại dương...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-3xl text-center text-rose-200 text-sm">
          {error}
        </div>
      ) : explored.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-[#1b254b]/60 border border-white/10 rounded-3xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-pacific-blue-bright/10 border border-pacific-blue-bright/20 flex items-center justify-center text-pacific-cyan mb-4 shadow-lg">
            <Compass size={28} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Chưa có dấu chân thám hiểm</h3>
          <p className="text-xs text-white/50 max-w-sm mb-5">
            Bạn chưa bắt đầu hành trình khám phá các vùng biển kỳ thú. Hãy bước vào bản đồ đại dương để mở khóa những vùng biển mới!
          </p>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pacific-blue-bright to-pacific-cyan text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            <Compass size={16} />
            <span>Thám hiểm bản đồ biển</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {explored.map((item) => (
              <div
                key={item.locationId}
                className="group bg-[#1b254b]/80 hover:bg-[#202c59] border border-white/10 hover:border-pacific-cyan/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_25px_rgba(14,165,233,0.2)] hover:-translate-y-1 flex flex-col"
              >
                <div className="relative aspect-16/9 w-full bg-[#121933] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-pacific-cyan font-bold">
                    <MapPin size={14} />
                    <span>{item.name}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                    {item.description || "Vùng biển sâu với hệ sinh thái phong phú và độc đáo."}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
                    <span>
                      Khám phá:{" "}
                      {item.exploredDate
                        ? new Date(item.exploredDate).toLocaleDateString("vi-VN")
                        : "Gần đây"}
                    </span>
                    <span className="text-emerald-400 font-semibold">Đã mở khóa ✓</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => loadExplored(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-semibold text-white/70 px-3">
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => loadExplored(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
