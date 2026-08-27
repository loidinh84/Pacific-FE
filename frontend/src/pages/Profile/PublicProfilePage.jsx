import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Compass, Calendar, Shield, Sparkles, Share2, Check, ArrowLeft, Loader2, Award } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { fetchPublicProfile } from "../../services/userService";

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetchPublicProfile(username);
        if (res.success) {
          setProfileData(res.user);
        } else {
          setError(res.error || "Không tìm thấy hồ sơ người dùng");
        }
      } catch (err) {
        console.error("Lỗi khi tải hồ sơ công khai:", err);
        setError("Người dùng này không tồn tại hoặc đã bị khóa.");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      loadProfile();
    }
  }, [username]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper rank badge
  const getExplorerRank = (favoritesCount = 0, locationsCount = 0) => {
    const total = favoritesCount + locationsCount;
    if (total >= 20) return { title: "Huyền Thoại Biển Sâu", color: "from-amber-400 to-rose-500", icon: Award };
    if (total >= 10) return { title: "Nhà Sinh Học Đại Dương", color: "from-purple-500 to-indigo-500", icon: Sparkles };
    if (total >= 5) return { title: "Thợ Lặn Kỳ Cựu", color: "from-cyan-400 to-blue-500", icon: Compass };
    return { title: "Tân Thủ Thám Hiểm", color: "from-emerald-400 to-teal-500", icon: Compass };
  };

  const rank = profileData ? getExplorerRank(profileData.stats?.totalFavorites, profileData.stats?.totalLocationsExplored) : null;
  const RankIcon = rank?.icon || Compass;

  return (
    <div className="min-h-screen bg-[#0d1326] text-white flex flex-col font-sans selection:bg-pacific-cyan selection:text-black">
      <Navbar />

      <div className="flex-1 pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Khám phá sinh vật biển</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 size={40} className="text-pacific-cyan animate-spin mb-4" />
            <p className="text-sm font-medium text-white/70">Đang tải hồ sơ cộng đồng...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 bg-[#1b254b]/50 border border-white/10 rounded-3xl text-center">
            <h2 className="text-xl font-bold text-white mb-2">Hồ sơ không khả dụng</h2>
            <p className="text-xs text-white/60 mb-6 max-w-md">{error}</p>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full bg-pacific-blue-bright text-white text-xs font-bold hover:brightness-110 transition-all"
            >
              Về trang chủ
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* HERO PROFILE CARD */}
            <div className="relative bg-[#1b254b]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-pacific-blue-bright/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-400 p-1 shadow-[0_15px_35px_rgba(14,165,233,0.3)]">
                    <div className="w-full h-full bg-[#161f3e] rounded-[22px] flex items-center justify-center overflow-hidden">
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt={profileData.username} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-black text-white">
                          {profileData.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Info (Chỉ thông tin public) */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-2.5">
                        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                          @{profileData.username}
                        </h1>
                        {profileData.role === "admin" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                            <Shield size={12} />
                            <span>Quản trị viên</span>
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center justify-center md:justify-start gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rank.color} text-white shadow-md`}>
                          <RankIcon size={13} />
                          <span>{rank.title}</span>
                        </span>
                      </div>
                    </div>

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full text-xs font-semibold text-white transition-all active:scale-95 cursor-pointer self-center md:self-start"
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span className="text-emerald-400">Đã chép link!</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={14} className="text-pacific-cyan" />
                          <span>Chia sẻ hồ sơ</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                    {profileData.bio || "Thành viên yêu thích tìm hiểu thế giới sinh vật và bí ẩn đại dương."}
                  </p>

                  <div className="pt-2 flex items-center justify-center md:justify-start gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-indigo-400" />
                      Gia nhập từ:{" "}
                      {profileData.joinedDate
                        ? new Date(profileData.joinedDate).toLocaleDateString("vi-VN")
                        : "2026"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK STATS CARDS (Đọ thành tích) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#1b254b]/80 border border-white/10 rounded-2xl p-5 text-center shadow-lg">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Heart size={20} />
                </div>
                <span className="block text-2xl font-black text-white font-heading">
                  {profileData.stats?.totalFavorites || 0}
                </span>
                <span className="text-xs text-white/50 font-medium">Sinh vật yêu thích</span>
              </div>

              <div className="bg-[#1b254b]/80 border border-white/10 rounded-2xl p-5 text-center shadow-lg">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-pacific-cyan/10 border border-pacific-cyan/20 flex items-center justify-center text-pacific-cyan">
                  <Compass size={20} />
                </div>
                <span className="block text-2xl font-black text-white font-heading">
                  {profileData.stats?.totalLocationsExplored || 0}
                </span>
                <span className="text-xs text-white/50 font-medium">Địa điểm thám hiểm</span>
              </div>

              <div className="bg-[#1b254b]/80 border border-white/10 rounded-2xl p-5 text-center shadow-lg">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Sparkles size={20} />
                </div>
                <span className="block text-2xl font-black text-white font-heading">
                  {profileData.stats?.memberDays || 1}
                </span>
                <span className="text-xs text-white/50 font-medium">Ngày gắn bó</span>
              </div>

              <div className="bg-[#1b254b]/80 border border-white/10 rounded-2xl p-5 text-center shadow-lg">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Award size={20} />
                </div>
                <span className="block text-sm font-bold text-white font-heading mt-1.5">
                  {rank.title.split(" ")[0]}
                </span>
                <span className="text-xs text-white/50 font-medium">Danh hiệu đại dương</span>
              </div>
            </div>

            {/* SHOWCASE BỘ SƯU TẬP SINH VẬT CÔNG KHAI */}
            <div className="bg-[#1b254b]/80 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                    <Heart size={20} className="text-rose-400" />
                    <span>Bộ sưu tập sinh vật nổi bật</span>
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Các loài sinh vật mà @{profileData.username} đang quan tâm và sưu tập
                  </p>
                </div>
              </div>

              {profileData.collection?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {profileData.collection.map((creature) => (
                    <Link
                      key={creature.id}
                      to={`/species/${creature.slug || creature.id}`}
                      className="group bg-[#151d3b] hover:bg-[#1a254c] border border-white/10 hover:border-pacific-cyan/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-md flex flex-col"
                    >
                      <div className="relative aspect-4/3 w-full bg-[#10172e] overflow-hidden">
                        <img
                          src={creature.image}
                          alt={creature.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-bold text-white group-hover:text-pacific-cyan transition-colors truncate">
                          {creature.name}
                        </h4>
                        <p className="text-[10px] text-white/50 italic truncate">
                          {creature.scientificName}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-white/40">
                  Người dùng này chưa thêm sinh vật nào vào bộ sưu tập công khai.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
