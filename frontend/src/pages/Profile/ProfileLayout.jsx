import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Heart, Compass, Loader2, Sparkles, Calendar, Shield } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import GeneralTab from "./GeneralTab";
import FavoritesTab from "./FavoritesTab";
import ExploredTab from "./ExploredTab";
import EditProfileModal from "./EditProfileModal";
import { fetchMyProfile, fetchMyStats } from "../../services/userService";

export default function ProfileLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'favorites' | 'explored'
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, statsRes] = await Promise.all([
        fetchMyProfile(),
        fetchMyStats().catch(() => ({ stats: null })),
      ]);

      if (profileRes.success) {
        setUser(profileRes.user);
      }
      if (statsRes && statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error("Lỗi khi tải hồ sơ:", err);
      // If 401, redirect to login
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleProfileUpdated = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const navItems = [
    { id: "general", label: "Tổng quát", icon: User },
    { id: "favorites", label: "Sinh vật yêu thích", icon: Heart },
    { id: "explored", label: "Đã khám phá", icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-pacific-figma-dark text-white flex flex-col font-sans selection:bg-pacific-cyan selection:text-black relative overflow-hidden">
      {/* Background Ambient Sunbeams & Ocean Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(14,165,233,0.25)_0%,rgba(6,182,212,0.1)_40%,transparent_75%)] pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-pacific-blue-bright/15 blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-indigo-500/15 blur-[150px] pointer-events-none" />

      {/* Top Main Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 size={40} className="text-pacific-cyan animate-spin mb-4" />
            <p className="text-sm font-medium text-white/70">Đang tải thông tin hồ sơ của bạn...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT SIDEBAR (Sidebar bên trái theo đúng mockup) */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Back button */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Hồ sơ cá nhân</span>
              </Link>

              {/* Sidebar Menu Container */}
              <div className="bg-[#1b254b]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-5 shadow-2xl space-y-5">
                <div>
                  <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-3 px-3">
                    Cài đặt
                  </h3>
                  <nav className="space-y-1.5">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-gradient-to-r from-pacific-blue-bright to-pacific-cyan text-white shadow-[0_8px_20px_rgba(14,165,233,0.3)] translate-x-1"
                              : "text-white/70 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Icon size={16} className={isActive ? "text-white" : "text-pacific-cyan"} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Mini Stats Card */}
                {stats && (
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-400" />
                      <span>Thành tích của bạn</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                        <span className="block text-base font-black text-rose-400 font-heading">
                          {stats.totalFavorites || 0}
                        </span>
                        <span className="text-[10px] text-white/50 font-medium">Yêu thích</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                        <span className="block text-base font-black text-pacific-cyan font-heading">
                          {stats.totalLocationsExplored || 0}
                        </span>
                        <span className="text-[10px] text-white/50 font-medium">Khám phá</span>
                      </div>
                    </div>

                    <div className="mt-2.5 p-2 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-[11px] px-3">
                      <span className="text-white/50 flex items-center gap-1.5">
                        <Calendar size={13} className="text-indigo-400" />
                        Gắn bó:
                      </span>
                      <span className="font-bold text-white">{stats.memberDays || 1} ngày</span>
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* RIGHT MAIN CONTENT AREA */}
            <main className="lg:col-span-9">
              {/* Header Title */}
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                  {activeTab === "general" && "Thông tin chung"}
                  {activeTab === "favorites" && "Sinh vật yêu thích"}
                  {activeTab === "explored" && "Địa điểm đã khám phá"}
                </h1>
              </div>

              {/* Tab Contents */}
              {activeTab === "general" && (
                <GeneralTab
                  user={user}
                  onOpenEditModal={() => setIsEditModalOpen(true)}
                  onProfileUpdated={handleProfileUpdated}
                />
              )}

              {activeTab === "favorites" && <FavoritesTab />}

              {activeTab === "explored" && <ExploredTab />}
            </main>
          </div>
        )}
      </div>

      {/* Edit Profile Modal Popup */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}
