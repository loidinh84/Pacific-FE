import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  X,
  Search,
  Play,
  Pause,
  Check,
  Music,
  Loader2,
  AlertCircle,
  Globe,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";
import { getOceanAudioLibrary, searchOceanAudioAdvanced } from "../../../services/speciesApi";

export default function OceanSoundPickerModal({
  isOpen,
  onClose,
  onSelectSound,
  currentSoundUrl = "",
}) {
  const { isDark } = useTheme();
  useLockBodyScroll(isOpen);

  // allSounds: full list loaded from API (source of truth, never mutated)
  const [allSounds, setAllSounds] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const [isLoadingInit, setIsLoadingInit] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [initError, setInitError] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  const categories = [
    "Tất cả",
    "Cá voi & Thân mềm",
    "Cá heo & Cá mập",
    "Môi trường biển sâu",
    "Cơ sở dữ liệu Sinh học Biển",
  ];

  // ─── Load default catalog ONCE when modal opens ──────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (allSounds.length > 0) return; // already loaded

    let isMounted = true;
    const load = async () => {
      setIsLoadingInit(true);
      setInitError(null);
      try {
        const res = await getOceanAudioLibrary("Tất cả");
        if (isMounted && res?.success && Array.isArray(res.data)) {
          setAllSounds(res.data);
        }
      } catch {
        if (isMounted) setInitError("Không thể tải danh sách âm thanh. Kiểm tra kết nối Backend.");
      } finally {
        if (isMounted) setIsLoadingInit(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Local filter: derived value — no side effects, no useEffect needed ────
  const displayedSounds = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allSounds.filter((item) => {
      const matchCat = selectedCategory === "Tất cả" || item.category === selectedCategory;
      const matchQ =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.species.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [searchTerm, selectedCategory, allSounds]);

  // ─── Cleanup audio on unmount ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // ─── Handle modal close with clean state reset ────────────────────────────
  const handleClose = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingId(null);
    setSearchTerm("");
    setSelectedCategory("Tất cả");
    setSearchError(null);
    onClose();
  }, [onClose]);

  // ─── Advanced Freesound search ─────────────────────────────────────────────
  const handleAdvancedSearch = useCallback(async () => {
    const q = searchTerm.trim();
    if (!q) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await searchOceanAudioAdvanced(q);
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        // Merge new results into allSounds (dedup by pageid/id)
        setAllSounds((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const newItems = res.data.filter((s) => !existingIds.has(s.id));
          return [...prev, ...newItems];
        });
      } else {
        setSearchError(`Không tìm thấy bản ghi nào cho "${q}" trên Freesound.org.`);
      }
    } catch {
      setSearchError("Lỗi kết nối Freesound. Vui lòng thử lại.");
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm]);

  if (!isOpen) return null;

  // ─── Audio play/pause ──────────────────────────────────────────────────────
  const handlePlayToggle = (sound) => {
    if (playingId === sound.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      audioRef.current?.pause();
      const audio = new Audio(sound.url);
      audio.crossOrigin = "anonymous";
      audio.volume = 0.9;
      audioRef.current = audio;
      setPlayingId(sound.id);
      audio.play().catch((err) => {
        console.warn("Audio play error:", err);
        setPlayingId(null);
      });
      audio.onended = () => setPlayingId(null);
    }
  };

  const handleSelect = (sound) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingId(null);
    setSearchTerm("");
    setSelectedCategory("Tất cả");
    setSearchError(null);
    onSelectSound(sound.url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/30 animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="flex-1" onClick={handleClose} />

      {/* Slide-over Right Panel */}
      <div
        className={`w-full max-w-lg h-full border-l flex flex-col shadow-xl animate-in slide-in-from-right duration-300 ${
          isDark
            ? "bg-[#0b1329] border-cyan-500/30 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            : "bg-white border-slate-200 text-slate-900 shadow-xl"
        }`}
      >
        {/* ── Header ── */}
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? "border-white/10" : "border-slate-100"}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
              <Music size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>Kho Âm Thanh Đại Dương</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold border border-cyan-400/30">
                  {allSounds.length} bản ghi
                </span>
              </h3>
              <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Dữ liệu thực tế từ Freesound.org Community Bioacoustics
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? "border-white/15 hover:bg-white/10 text-white/70"
                : "border-slate-200 hover:bg-slate-100 text-slate-500"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Search & Filter ── */}
        <div className={`p-4 border-b space-y-3 ${isDark ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50/50"}`}>
          {/* Search input + advanced search button */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                className={`absolute left-3.5 top-3 ${isDark ? "text-white/40" : "text-slate-400"}`}
              />
              <input
                type="text"
                placeholder="Lọc theo tên loài, âm thanh... (VD: cá voi, dolphin)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdvancedSearch()}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                  isDark
                    ? "bg-slate-900/90 border border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400"
                    : "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                }`}
              />
            </div>
            {/* Advanced Freesound search button */}
            <button
              type="button"
              onClick={handleAdvancedSearch}
              disabled={!searchTerm.trim() || isSearching}
              title="Tìm kiếm thêm trực tiếp trên Freesound.org"
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                !searchTerm.trim() || isSearching
                  ? isDark ? "opacity-30 border-white/10 text-white/30" : "opacity-30 border-slate-200 text-slate-400"
                  : isDark
                    ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30"
                    : "bg-cyan-50 border-cyan-300 text-cyan-700 hover:bg-cyan-100"
              }`}
            >
              {isSearching ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Globe size={14} />
              )}
              <span className="hidden sm:inline">Freesound</span>
            </button>
          </div>

          {/* Search error / no results from advanced search */}
          {searchError && (
            <p className="text-[11px] text-amber-400 flex items-center gap-1.5 px-1">
              <AlertCircle size={12} /> {searchError}
            </p>
          )}

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-white shadow-sm font-bold"
                    : isDark
                      ? "bg-white/5 hover:bg-white/10 text-white/70"
                      : "bg-white hover:bg-slate-200 border text-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Audio List ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar-thin">
          {isLoadingInit ? (
            <div className="py-16 flex flex-col items-center justify-center text-sm text-cyan-400 gap-3">
              <Loader2 size={28} className="animate-spin" />
              <span>Đang tải danh sách từ Freesound.org...</span>
            </div>
          ) : initError ? (
            <div className="py-12 flex flex-col items-center justify-center text-sm text-rose-400 gap-2 text-center p-4">
              <AlertCircle size={28} />
              <span>{initError}</span>
            </div>
          ) : displayedSounds.length === 0 ? (
            <div className={`py-12 flex flex-col items-center justify-center gap-3 text-center ${isDark ? "text-white/40" : "text-slate-400"}`}>
              <Music size={36} className="opacity-30" />
              <p className="text-sm">
                {searchTerm
                  ? `Không có bản ghi nào khớp với "${searchTerm}" trong danh sách hiện tại.`
                  : "Không có bản ghi nào trong danh mục này."}
              </p>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleAdvancedSearch}
                  disabled={isSearching}
                  className="mt-1 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isSearching ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
                  Tìm "{searchTerm}" trên Freesound
                </button>
              )}
            </div>
          ) : (
            displayedSounds.map((sound) => {
              const isPlaying = playingId === sound.id;
              const isSelected = currentSoundUrl === sound.url;

              return (
                <div
                  key={sound.id}
                  className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                    isSelected
                      ? isDark
                        ? "bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        : "bg-cyan-50 border-cyan-400 shadow-sm"
                      : isDark
                        ? "bg-white/5 border-white/10 hover:border-cyan-500/30"
                        : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Play / Pause */}
                    <button
                      type="button"
                      onClick={() => handlePlayToggle(sound)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md ${
                        isPlaying
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white animate-pulse"
                          : "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30"
                      }`}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm leading-tight flex items-center gap-1.5 flex-wrap">
                        <span className="truncate">{sound.title}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1 shrink-0">
                            <Check size={10} /> Đã chọn
                          </span>
                        )}
                      </h4>
                      <p className={`text-[11px] mt-0.5 font-medium truncate ${isDark ? "text-cyan-300/80" : "text-cyan-700"}`}>
                        {sound.species}
                      </p>
                      <p className={`text-xs mt-1 leading-snug line-clamp-2 ${isDark ? "text-white/55" : "text-slate-500"}`}>
                        {sound.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className={`pt-2 border-t flex items-center justify-between text-xs ${isDark ? "border-white/10" : "border-slate-100"}`}>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${isDark ? "bg-white/5 text-white/40" : "bg-slate-100 text-slate-400"}`}>
                      {sound.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelect(sound)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 text-xs active:scale-95 ${
                        isSelected
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-cyan-500 hover:bg-cyan-400 text-white shadow-md"
                      }`}
                    >
                      <Check size={13} />
                      <span>{isSelected ? "Đang sử dụng" : "Chọn âm thanh này"}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
