import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Loader2, Compass, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchMyFavorites } from "../../services/userService";

export default function FavoritesTab() {
  const [favorites, setFavorites] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavorites = async (page = 1) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetchMyFavorites({ page, limit: 12 });
      if (res.success) {
        setFavorites(res.data || []);
        setPagination(res.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách yêu thích:", err);
      setError("Không thể tải danh sách sinh vật yêu thích!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2.5">
          <Heart size={22} className="text-rose-400 fill-rose-400/20" />
          <span>Sinh vật yêu thích ({pagination.total})</span>
        </h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#1b254b]/50 border border-white/10 rounded-3xl">
          <Loader2 size={32} className="text-pacific-cyan animate-spin mb-3" />
          <p className="text-xs text-white/60">Đang tải bộ sưu tập yêu thích...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-3xl text-center text-rose-200 text-sm">
          {error}
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-[#1b254b]/60 border border-white/10 rounded-3xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-lg">
            <Heart size={28} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Chưa có sinh vật yêu thích</h3>
          <p className="text-xs text-white/50 max-w-sm mb-5">
            Bạn chưa lưu sinh vật nào vào danh sách yêu thích. Hãy khám phá bách khoa sinh vật và thả tim những loài bạn ấn tượng nhất!
          </p>
          <Link
            to="/search"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pacific-blue-bright to-pacific-cyan text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            <Compass size={16} />
            <span>Khám phá sinh vật ngay</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {favorites.map((item) => (
              <Link
                key={item.creatureId}
                to={`/species/${item.slug || item.creatureId}`}
                className="group bg-[#1b254b]/80 hover:bg-[#202c59] border border-white/10 hover:border-pacific-cyan/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_25px_rgba(14,165,233,0.2)] hover:-translate-y-1 flex flex-col"
              >
                <div className="relative aspect-4/3 w-full bg-[#121933] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 backdrop-blur-md text-rose-400 border border-white/10">
                    <Heart size={14} className="fill-rose-500" />
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-pacific-cyan transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-white/50 italic truncate">
                      {item.scientificName}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40">
                    <span>Mã: {item.code}</span>
                    <span className="text-pacific-cyan font-semibold group-hover:underline">Chi tiết →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => loadFavorites(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-semibold text-white/70 px-3">
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => loadFavorites(pagination.page + 1)}
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
