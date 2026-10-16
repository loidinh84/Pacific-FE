import { useState, useEffect } from "react";
import {
  Users,
  Eye,
  Search,
  Fish,
  MessageSquare,
  Flag,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  UserCheck,
  UserX,
  UserPlus,
  Clock,
  Activity,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

/* ─────────────────────────────── MOCK DATA ─────────────────────────────── */
const MOCK_STATS = {
  users: { total: 1284, active: 347, newRegistrations: 1, locked: 5 },
  content: { totalSpecies: 1284, totalViews: 1284, searches: 1284, favoritedSpecies: 1284 },
  comments: { total: 1284, reported: 1284, today: 1284, deleted: 1284 },
};

const TRAFFIC_DATA = [
  { day: "T2", visits: 820, users: 340 },
  { day: "T3", visits: 932, users: 420 },
  { day: "T4", visits: 901, users: 380 },
  { day: "T5", visits: 1234, users: 580 },
  { day: "T6", visits: 1100, users: 510 },
  { day: "T7", visits: 890, users: 390 },
  { day: "CN", visits: 750, users: 290 },
  { day: "T2", visits: 980, users: 450 },
  { day: "T3", visits: 1150, users: 530 },
  { day: "T4", visits: 1050, users: 470 },
  { day: "T5", visits: 1320, users: 600 },
  { day: "T6", visits: 1480, users: 680 },
  { day: "T7", visits: 1200, users: 540 },
  { day: "CN", visits: 920, users: 400 },
];

const NEW_USERS_DATA = [
  { day: "12", count: 18 },
  { day: "13", count: 24 },
  { day: "14", count: 16 },
  { day: "15", count: 30 },
  { day: "16", count: 22 },
  { day: "Hom qua", count: 28 },
  { day: "6N", count: 35 },
];

const TOP_SPECIES = [
  { id: 1, name: "Ca map trang", views: 4621, emoji: "🦈" },
  { id: 2, name: "Ca map trang lon", views: 3540, emoji: "🦈" },
  { id: 3, name: "Ca voi xanh", views: 2917, emoji: "🐋" },
  { id: 4, name: "Muc khong lo", views: 2104, emoji: "🦑" },
  { id: 5, name: "Ca heo mui chai", views: 1882, emoji: "🐬" },
];

const ZONES = [
  { name: "Sunlight", species: 87, color: "#f59e0b" },
  { name: "Twilight", species: 24, color: "#818cf8" },
  { name: "Midnight", species: 16, color: "#22d3ee" },
  { name: "Abyssal", species: 9, color: "#6366f1" },
  { name: "Hadal", species: 6, color: "#ec4899" },
];

const TOP_CONTRIBUTORS = [
  { username: "nguyenvanA", count: "20/1w", status: "online" },
  { username: "nguyenvanB", count: "30/1w", status: "offline", detail: "5 phut truoc" },
  { username: "nguyenvanC", count: "25/1w", status: "offline", detail: "9 ngay truoc" },
  { username: "nguyenvanD", count: "20/1w", status: "offline", detail: "7 ngay truoc" },
  { username: "nguyenvanE", count: "11/1w", status: "offline", detail: "1 thang truoc" },
];

const RECENT_ACTIVITIES = [
  { user: "nguyenvanA", action: "da them", target: "Ca map trang", extra: "vao sinh vat yeu thich.", time: "2 phut truoc", type: "add" },
  { user: "nguyenvanB", action: "vua tao tai khoan moi.", target: "", extra: "", time: "3 phut truoc", type: "register" },
  { user: "nguyenvanB", action: "da binh luan o sinh vat", target: "Ca map trang", extra: ".", time: "4 phut truoc", type: "comment" },
  { user: "API GDF", action: "keo lai tai Ca", target: "voi lung gu", extra: "", time: "1 ngay truoc", type: "api" },
];

/* ─────────────────── STAT CARD ─────────────────── */
function StatCard({ icon: Icon, label, value, trend, trendDir, color, isDark }) {
  const trendColor = trendDir === "up" ? "text-emerald-400" : trendDir === "down" ? "text-rose-400" : "text-slate-400";
  const TrendIcon = trendDir === "up" ? TrendingUp : trendDir === "down" ? TrendingDown : Minus;
  return (
    <div className={`rounded-2xl p-4 flex flex-col gap-3 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${isDark ? "bg-[#182040] border-white/8 hover:border-white/20" : "bg-white border-slate-200 hover:border-blue-200 shadow-sm"}`}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "22" }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span className={`text-xs font-medium leading-tight ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className={`text-2xl font-bold font-heading tabular-nums ${isDark ? "text-white" : "text-slate-800"}`}>{value?.toLocaleString()}</span>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-medium ${trendColor}`}>
            <TrendIcon size={12} />
            <span className="text-right leading-tight">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, isDark }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={15} className={isDark ? "text-cyan-400" : "text-blue-500"} />
      <h2 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>{title}</h2>
    </div>
  );
}

/* ─────────────────── LINE CHART (SVG) ─────────────────── */
function LineChart({ data, isDark }) {
  const maxV = Math.max(...data.map((d) => d.visits));
  const minV = Math.min(...data.map((d) => d.visits));
  const maxU = Math.max(...data.map((d) => d.users));
  const minU = Math.min(...data.map((d) => d.users));
  const W = 280; const H = 100;
  const nV = (v) => H - 10 - ((v - minV) / (maxV - minV + 1)) * (H - 20);
  const nU = (v) => H - 10 - ((v - minU) / (maxU - minU + 1)) * (H - 20);
  const vPts = data.map((d, i) => `${(i / (data.length - 1)) * W},${nV(d.visits)}`).join(" ");
  const uPts = data.map((d, i) => `${(i / (data.length - 1)) * W},${nU(d.users)}`).join(" ");
  const vPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * W},${nV(d.visits)}`).join(" ");
  const uPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * W},${nU(d.users)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24 overflow-visible">
      <defs>
        <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p, i) => (
        <line key={i} x1="0" y1={H * p} x2={W} y2={H * p} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"} strokeWidth="1" />
      ))}
      <path d={vPath + ` L ${W},${H} L 0,${H} Z`} fill="url(#vg)" />
      <path d={uPath + ` L ${W},${H} L 0,${H} Z`} fill="url(#ug)" />
      <polyline points={vPts} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={uPts} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={W} cy={nV(data[data.length - 1].visits)} r="3" fill="#22d3ee" />
      <circle cx={W} cy={nU(data[data.length - 1].users)} r="3" fill="#818cf8" />
    </svg>
  );
}

/* ─────────────────── BAR CHART (SVG) ─────────────────── */
function BarChart({ data, isDark }) {
  const max = Math.max(...data.map((d) => d.count));
  const W = 200; const H = 80;
  const bW = W / data.length - 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20">
      {data.map((d, i) => {
        const bh = (d.count / max) * (H - 14);
        const x = i * (W / data.length) + 2;
        const y = H - bh - 10;
        const alpha = 0.4 + (d.count / max) * 0.6;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bW} height={bh} rx="3" fill={`rgba(96,165,250,${alpha})`} />
            <text x={x + bW / 2} y={H - 2} textAnchor="middle" fontSize="6" fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}>{d.day}</text>
            <text x={x + bW / 2} y={y - 2} textAnchor="middle" fontSize="6" fill={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"}>{d.count}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────── MAIN DASHBOARD ─────────────────── */
export default function AdminDashboard() {
  const { isDark } = useTheme();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setLastUpdated(new Date()); setRefreshing(false); }, 800);
  };

  const fmt = (d) => d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const actColors = { add: "bg-emerald-500", register: "bg-blue-500", comment: "bg-amber-500", api: "bg-purple-500" };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`text-2xl font-bold font-heading ${isDark ? "text-white" : "text-slate-800"}`}>Tong quan he thong</h1>
          <p className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Cap nhat luc {fmt(lastUpdated)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRefresh} disabled={refreshing} className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"}`}>
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            <span>Lam moi</span>
          </button>
          <div className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1 ${isDark ? "bg-[#1e2d55] border-white/10 text-cyan-300" : "bg-blue-50 border-blue-200 text-blue-600"}`}>
            <Clock size={11} />
            <span>7 ngay qua</span>
          </div>
        </div>
      </div>

      {/* Users */}
      <section>
        <SectionHeader icon={Users} title="Nguoi dung" isDark={isDark} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Tong tai khoan" value={MOCK_STATS.users.total} trend="+40 trong 7 ngay qua" trendDir="up" color="#22d3ee" isDark={isDark} />
          <StatCard icon={UserCheck} label="Dang hoat dong" value={MOCK_STATS.users.active} trend="+12% so voi tuan truoc" trendDir="up" color="#34d399" isDark={isDark} />
          <StatCard icon={UserPlus} label="Tai khoan vua dang ky" value={MOCK_STATS.users.newRegistrations} trend="-6 hon tuan truoc 2%" trendDir="down" color="#fb923c" isDark={isDark} />
          <StatCard icon={UserX} label="Tai khoan bi khoa" value={MOCK_STATS.users.locked} trend="Khong thay doi" trendDir="neutral" color="#f43f5e" isDark={isDark} />
        </div>
      </section>

      {/* Content */}
      <section>
        <SectionHeader icon={Eye} title="Noi dung & luot xem" isDark={isDark} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Fish} label="Tong sinh vat trong he thong" value={MOCK_STATS.content.totalSpecies} trend="+5 trong 7 ngay qua" trendDir="up" color="#818cf8" isDark={isDark} />
          <StatCard icon={Eye} label="Luot xem chi tiet sinh vat" value={MOCK_STATS.content.totalViews} trend="+5 trong 7 ngay qua" trendDir="up" color="#22d3ee" isDark={isDark} />
          <StatCard icon={Search} label="Luot tim kiem" value={MOCK_STATS.content.searches} trend="+5 trong 7 ngay qua" trendDir="up" color="#f59e0b" isDark={isDark} />
          <StatCard icon={Fish} label="Sinh vat da suu tap" value={MOCK_STATS.content.favoritedSpecies} trend="+5 trong 7 ngay qua" trendDir="up" color="#34d399" isDark={isDark} />
        </div>
      </section>

      {/* Comments */}
      <section>
        <SectionHeader icon={MessageSquare} title="Binh luan" isDark={isDark} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={MessageSquare} label="Tong binh luan" value={MOCK_STATS.comments.total} trend="+5 trong 7 ngay qua" trendDir="up" color="#22d3ee" isDark={isDark} />
          <StatCard icon={Flag} label="Bao cao vi pham" value={MOCK_STATS.comments.reported} trend="+5 trong 7 ngay qua" trendDir="up" color="#f59e0b" isDark={isDark} />
          <StatCard icon={MessageSquare} label="Binh luan hom nay" value={MOCK_STATS.comments.today} trend="+5 trong 7 ngay qua" trendDir="up" color="#34d399" isDark={isDark} />
          <StatCard icon={Trash2} label="Da xoa" value={MOCK_STATS.comments.deleted} trend="+5 trong 7 ngay qua" trendDir="up" color="#f43f5e" isDark={isDark} />
        </div>
      </section>

      {/* Charts */}
      <section>
        <SectionHeader icon={BarChart2} title="Thong ke qua bieu do" isDark={isDark} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={`rounded-2xl border p-4 ${isDark ? "bg-[#182040] border-white/8" : "bg-white border-slate-200 shadow-sm"}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>Luot truy cap — 7 ngay gan nhat</p>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /><span className={isDark ? "text-slate-400" : "text-slate-500"}>Luot truy cap</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" /><span className={isDark ? "text-slate-400" : "text-slate-500"}>Tai khoan</span></span>
              </div>
            </div>
            <LineChart data={TRAFFIC_DATA} isDark={isDark} />
            <div className="flex justify-between mt-1">
              {TRAFFIC_DATA.filter((_, i) => i % 2 === 0).map((d, i) => (
                <span key={i} className={`text-[9px] ${isDark ? "text-slate-600" : "text-slate-400"}`}>{d.day}</span>
              ))}
            </div>
          </div>
          <div className={`rounded-2xl border p-4 ${isDark ? "bg-[#182040] border-white/8" : "bg-white border-slate-200 shadow-sm"}`}>
            <p className={`text-xs font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>Nguoi dung moi — 7 ngay</p>
            <BarChart data={NEW_USERS_DATA} isDark={isDark} />
          </div>
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Top 5 species */}
        <div className={`rounded-2xl border p-4 col-span-1 md:col-span-2 ${isDark ? "bg-[#182040] border-white/8" : "bg-white border-slate-200 shadow-sm"}`}>
          <p className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            <TrendingUp size={13} className={isDark ? "text-cyan-400" : "text-blue-500"} />
            Top 5 sinh vat duoc xem nhieu nhat
          </p>
          <div className="space-y-2.5">
            {TOP_SPECIES.map((s, i) => {
              const pct = (s.views / TOP_SPECIES[0].views) * 100;
              return (
                <div key={s.id} className="flex items-center gap-2.5">
                  <span className={`text-xs font-bold w-4 text-center ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-700" : isDark ? "text-slate-500" : "text-slate-400"}`}>{i + 1}</span>
                  <span className="text-base">{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-medium truncate ${isDark ? "text-slate-200" : "text-slate-700"}`}>{s.name}</span>
                      <span className={`text-xs font-bold tabular-nums ml-2 ${isDark ? "text-cyan-300" : "text-blue-600"}`}>{s.views.toLocaleString()}</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #22d3ee, #818cf8)" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zones */}
        <div className={`rounded-2xl border p-4 ${isDark ? "bg-[#182040] border-white/8" : "bg-white border-slate-200 shadow-sm"}`}>
          <p className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            <Activity size={13} className={isDark ? "text-cyan-400" : "text-blue-500"} />
            Sinh vat theo tang
          </p>
          <div className="space-y-2.5">
            {ZONES.map((z) => (
              <div key={z.name}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>{z.name}</span>
                  <span className="font-bold" style={{ color: z.color }}>{z.species} loai</span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                  <div className="h-full rounded-full" style={{ width: `${(z.species / ZONES[0].species) * 100}%`, backgroundColor: z.color, opacity: 0.85 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributors */}
        <div className={`rounded-2xl border p-4 ${isDark ? "bg-[#182040] border-white/8" : "bg-white border-slate-200 shadow-sm"}`}>
          <p className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            <Users size={13} className={isDark ? "text-cyan-400" : "text-blue-500"} />
            Nguoi dung thuong xuyen nhat
          </p>
          <div className="space-y-2.5">
            {TOP_CONTRIBUTORS.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, hsl(${(i * 60 + 200) % 360}, 70%, 45%), hsl(${(i * 60 + 240) % 360}, 70%, 35%))` }}>
                    {c.username[0].toUpperCase()}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border ${c.status === "online" ? "bg-emerald-400" : "bg-slate-500"} ${isDark ? "border-[#182040]" : "border-white"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isDark ? "text-slate-200" : "text-slate-700"}`}>{c.username}</p>
                  <p className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {c.count} • {c.status === "online" ? <span className="text-emerald-400">Dang hoat dong</span> : c.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <section>
        <SectionHeader icon={Activity} title="Hoat dong gan day" isDark={isDark} />
        <div className={`rounded-2xl border p-4 space-y-3 ${isDark ? "bg-[#182040] border-white/8" : "bg-white border-slate-200 shadow-sm"}`}>
          {RECENT_ACTIVITIES.map((act, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${actColors[act.type]}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-snug ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  <span className="font-semibold text-cyan-400">{act.user}</span> {act.action}{act.target && <> <span className={`font-medium ${isDark ? "text-white" : "text-slate-800"}`}>{act.target}</span></>} {act.extra}
                </p>
                <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-600" : "text-slate-400"}`}>{act.time}</p>
              </div>
            </div>
          ))}
          <button className={`text-xs mt-1 transition-colors cursor-pointer ${isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-500 hover:text-blue-700"}`}>Xem them →</button>
        </div>
      </section>
    </div>
  );
}
