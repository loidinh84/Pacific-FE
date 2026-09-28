import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Database,
  Check,
  Zap,
  Search,
  Activity,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";
import {
  fetchApiSyncStatus,
  retrySyncSpeciesItem,
  syncAllIncompleteSpecies,
  fetchAdminApiProviders,
  createAdminApiProvider,
  updateAdminApiProvider,
  deleteAdminApiProvider,
  testAdminApiProvider,
} from "../../../services/speciesApi";

// Catalog Presets for Quick Adding
const CATALOG_PRESETS = [
  {
    id: "eol",
    name: "Encyclopedia of Life (EOL)",
    desc: "Bách khoa toàn thư Sự sống Toàn cầu (Smithsonian / National Museum of Natural History)",
    category: "encyclopedia",
    endpoint: "https://eol.org/api/search/1.0.json?q=octopus&page=1",
    docsUrl: "https://eol.org/docs/what-is-eol/data-services/classic-apis",
  },
  {
    id: "noaa",
    name: "NOAA Ocean Explorer",
    desc: "Dữ liệu Hải dương học & Rạn san hô Quốc gia Hoa Kỳ (NOAA NCEI)",
    category: "oceanography",
    endpoint: "https://www.ncei.noaa.gov",
    docsUrl: "https://www.ncei.noaa.gov/",
  },
  {
    id: "sealifebase",
    name: "SeaLifeBase Ecology",
    desc: "Cơ sở dữ liệu sinh thái sinh vật biển phi cá (giáp xác, san hô, thân mềm)",
    category: "traits",
    endpoint: "https://sealifebase.ca/",
    docsUrl: "https://sealifebase.ca/",
  },
  {
    id: "iucn",
    name: "IUCN Red List API",
    desc: "Danh lục Đỏ các loài bị đe dọa toàn cầu (International Union for Conservation of Nature)",
    category: "biodiversity",
    endpoint: "https://api.iucnredlist.org/api/v4",
    docsUrl: "https://apiv4.iucnredlist.org/",
  },
  {
    id: "obis",
    name: "OBIS Ocean Biodiversity",
    desc: "Hệ thống Thông tin Đa dạng Sinh thái Đại dương Toàn cầu (UNESCO / IOC)",
    category: "oceanography",
    endpoint: "https://api.obis.org/v3/taxon/2688",
    docsUrl: "https://api.obis.org/",
  },
  {
    id: "worms",
    name: "WoRMS Marine Register",
    desc: "Sổ Đăng kiểm Sinh vật biển Toàn cầu (World Register of Marine Species)",
    category: "taxonomy",
    endpoint:
      "https://www.marinespecies.org/rest/AphiaRecordsByName/Delphinidae?like=false",
    docsUrl: "https://www.marinespecies.org/rest/",
  },
  {
    id: "fishbase",
    name: "FishBase Global Traits",
    desc: "Ngân hàng dữ liệu đặc tính sinh học, kích thước và độ sâu loài cá biển",
    category: "traits",
    endpoint:
      "https://api.gbif.org/v1/species?datasetKey=d9a4eedb-e985-4456-ad46-3df8472e00e8&limit=1",
    docsUrl: "https://www.fishbase.se/",
  },
  {
    id: "algaebase",
    name: "AlgaeBase Registry",
    desc: "Cơ sở dữ liệu thực vật phù du, tảo và cỏ biển đại dương toàn cầu",
    category: "biodiversity",
    endpoint: "https://www.algaebase.org/api/",
    docsUrl: "https://www.algaebase.org/",
  },
];

const CATEGORY_LABELS = {
  biodiversity: {
    label: "Đa dạng sinh thái",
    color: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  },
  media: {
    label: "Hình ảnh & Quan sát",
    color: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
  },
  taxonomy: {
    label: "Phân loại học",
    color: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
  },
  oceanography: {
    label: "Hải dương học",
    color: "bg-sky-500/15 text-sky-300 border-sky-400/30",
  },
  encyclopedia: {
    label: "Bách khoa toàn thư",
    color: "bg-purple-500/15 text-purple-300 border-purple-400/30",
  },
  traits: {
    label: "Chỉ số sinh học",
    color: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  },
  custom: {
    label: "Tùy chỉnh",
    color: "bg-pink-500/15 text-pink-300 border-pink-400/30",
  },
};

const CATEGORY_OPTIONS = [
  {
    value: "custom",
    label: "Tùy chỉnh",
    color: "bg-pink-500/15 text-pink-300 border-pink-400/30",
  },
  {
    value: "biodiversity",
    label: "Đa dạng sinh thái",
    color: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  },
  {
    value: "media",
    label: "Hình ảnh & Quan sát",
    color: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
  },
  {
    value: "taxonomy",
    label: "Phân loại học",
    color: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
  },
  {
    value: "traits",
    label: "Chỉ số sinh học",
    color: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  },
  {
    value: "encyclopedia",
    label: "Bách khoa toàn thư",
    color: "bg-purple-500/15 text-purple-300 border-purple-400/30",
  },
  {
    value: "oceanography",
    label: "Hải dương học",
    color: "bg-sky-500/15 text-sky-300 border-sky-400/30",
  },
];

function CustomCategorySelect({ options, value, onChange, isDark }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    options.find((opt) => String(opt.value) === String(value)) || options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all cursor-pointer shadow-sm ${
          isDark
            ? "bg-white/5 border border-white/15 text-white hover:border-cyan-400/50 hover:bg-white/10"
            : "bg-slate-50 border border-slate-300 text-slate-900 hover:border-cyan-500/50"
        } ${
          open
            ? isDark
              ? "border-cyan-400 ring-2 ring-cyan-400/20"
              : "border-cyan-500 ring-2 ring-cyan-500/20"
            : ""
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold border ${selectedOption?.color}`}
          >
            {selectedOption?.label}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 ${
            open
              ? "rotate-180 text-cyan-400"
              : isDark
                ? "text-cyan-400/70"
                : "text-slate-400"
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl border shadow-2xl overflow-y-auto max-h-56 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl ${
            isDark
              ? "bg-[#0c1630]/98 border-cyan-500/30 text-white shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.15)]"
              : "bg-white/98 border-slate-200 text-slate-900 shadow-xl"
          }`}
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-all text-left cursor-pointer ${
                  isSelected
                    ? isDark
                      ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30"
                      : "bg-cyan-50 text-cyan-700 font-bold border border-cyan-200"
                    : isDark
                      ? "hover:bg-white/10 text-slate-200 hover:text-white"
                      : "hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold border ${opt.color}`}
                  >
                    {opt.label}
                  </span>
                </div>
                {isSelected && (
                  <CheckCircle2
                    size={16}
                    className="text-cyan-400 shrink-0 ml-2"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ApiSyncModal({ isOpen, onClose, onSyncAll }) {
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState("sync");

  // Sync Tab States
  const [apiStatuses, setApiStatuses] = useState([]);
  const [failedSpecies, setFailedSpecies] = useState([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [retryingId, setRetryingId] = useState(null);

  // Provider Management States
  const [providers, setProviders] = useState([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [providerSearch, setProviderSearch] = useState("");
  const [testingId, setTestingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Add Provider Seamless Screen / Form
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [addMode, setAddMode] = useState("catalog"); // 'catalog' | 'custom'
  const [customForm, setCustomForm] = useState({
    name: "",
    desc: "",
    endpoint: "",
    category: "custom",
    apiKey: "",
  });
  const [testResult, setTestResult] = useState(null);
  const [isTestingCustom, setIsTestingCustom] = useState(false);
  const [isSavingCustom, setIsSavingCustom] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useLockBodyScroll(isOpen);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadLiveSyncStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetchApiSyncStatus();
      if (res.success && res.data) {
        if (res.data.apiStatuses) setApiStatuses(res.data.apiStatuses);
        if (res.data.failedSpecies) setFailedSpecies(res.data.failedSpecies);
        if (res.data.allProviders) setProviders(res.data.allProviders);
      }
    } catch (err) {
      console.warn("Lỗi tải trạng thái đồng bộ:", err.message);
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  const loadProvidersList = useCallback(async (includePing = false) => {
    setIsLoadingProviders(true);
    try {
      const res = await fetchAdminApiProviders(includePing);
      if (res.success && Array.isArray(res.data)) {
        setProviders(res.data);
      }
    } catch (err) {
      console.warn("Lỗi tải danh sách API Providers:", err.message);
    } finally {
      setIsLoadingProviders(false);
    }
  }, []);

  // Load sync status and providers when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;
    const initData = async () => {
      setIsLoadingStatus(true);
      setIsLoadingProviders(true);
      try {
        const [syncRes, provRes] = await Promise.all([
          fetchApiSyncStatus().catch(() => null),
          fetchAdminApiProviders(false).catch(() => null),
        ]);

        if (ignore) return;

        if (syncRes?.success && syncRes.data) {
          if (syncRes.data.apiStatuses)
            setApiStatuses(syncRes.data.apiStatuses);
          if (syncRes.data.failedSpecies)
            setFailedSpecies(syncRes.data.failedSpecies);
          if (syncRes.data.allProviders)
            setProviders(syncRes.data.allProviders);
        }

        if (provRes?.success && Array.isArray(provRes.data)) {
          setProviders(provRes.data);
        }
      } finally {
        if (!ignore) {
          setIsLoadingStatus(false);
          setIsLoadingProviders(false);
        }
      }
    };

    initData();
    return () => {
      ignore = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ─── SYNC ACTIONS ────────────────────────────────────────────────────────
  const handleRetryItem = async (id) => {
    setRetryingId(id);
    try {
      await retrySyncSpeciesItem(id);
      setFailedSpecies((prev) => prev.filter((item) => item.id !== id));
      showToast("Đã đồng bộ thành công dữ liệu loài!");
      if (onSyncAll) onSyncAll();
    } catch {
      showToast("Đồng bộ thất bại, vui lòng thử lại.", "error");
    } finally {
      setRetryingId(null);
    }
  };

  const handleSyncAllClick = async () => {
    setIsSyncingAll(true);
    try {
      await syncAllIncompleteSpecies();
      setFailedSpecies([]);
      showToast("Đã hoàn tất đồng bộ tất cả sinh vật!");
      if (onSyncAll) onSyncAll();
    } catch {
      showToast("Có lỗi xảy ra khi đồng bộ hàng loạt.", "error");
    } finally {
      setIsSyncingAll(false);
    }
  };

  // ─── PROVIDER ACTIONS ────────────────────────────────────────────────────
  const handleToggleProvider = async (provider) => {
    const newStatus = !provider.isEnabled;
    setTogglingId(provider.id);

    // Optimistic UI update
    setProviders((prev) =>
      prev.map((p) =>
        p.id === provider.id ? { ...p, isEnabled: newStatus } : p,
      ),
    );

    try {
      const res = await updateAdminApiProvider(provider.id, {
        isEnabled: newStatus,
      });
      if (res.success) {
        showToast(`Đã ${newStatus ? "bật" : "tắt"} nguồn API ${provider.name}`);
        loadLiveSyncStatus();
      }
    } catch {
      // Revert on error
      setProviders((prev) =>
        prev.map((p) =>
          p.id === provider.id ? { ...p, isEnabled: !newStatus } : p,
        ),
      );
      showToast("Lỗi khi cập nhật trạng thái API.", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleTestProvider = async (provider) => {
    setTestingId(provider.id);
    try {
      const res = await testAdminApiProvider(provider.id);
      if (res.success && res.data) {
        setProviders((prev) =>
          prev.map((p) =>
            p.id === provider.id
              ? {
                  ...p,
                  status: res.data.status,
                  responseTimeMs: res.data.responseTimeMs,
                  statusMessage: res.data.message,
                }
              : p,
          ),
        );
        showToast(
          `${provider.name}: ${res.data.status === "ok" ? "Kết nối tốt" : "Phản hồi"} (${res.data.responseTimeMs || 0}ms)`,
        );
      }
    } catch {
      showToast(`Không thể kết nối đến ${provider.name}`, "error");
    } finally {
      setTestingId(null);
    }
  };

  const handleDeleteProvider = async (id, name) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa nguồn API "${name}" khỏi hệ sinh thái?`,
      )
    )
      return;
    setDeletingId(id);
    try {
      const res = await deleteAdminApiProvider(id);
      if (res.success) {
        setProviders((prev) => prev.filter((p) => p.id !== id));
        showToast(`Đã xóa nguồn API ${name}`);
        loadLiveSyncStatus();
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Lỗi khi xóa nguồn API", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // ─── ADD PROVIDER ACTIONS ────────────────────────────────────────────────
  const handleTestCustomEndpoint = async () => {
    if (!customForm.endpoint.trim()) {
      showToast("Vui lòng nhập Endpoint URL trước khi kiểm tra", "error");
      return;
    }
    setIsTestingCustom(true);
    setTestResult(null);
    try {
      const res = await testAdminApiProvider("custom", {
        endpoint: customForm.endpoint,
        apiKey: customForm.apiKey,
      });
      if (res.success && res.data) {
        setTestResult(res.data);
      }
    } catch (err) {
      setTestResult({
        success: false,
        status: "offline",
        message: err.response?.data?.error || "Lỗi kết nối",
      });
    } finally {
      setIsTestingCustom(false);
    }
  };

  const handleSaveCustomProvider = async () => {
    if (!customForm.name.trim()) {
      showToast("Vui lòng nhập tên nguồn API", "error");
      return;
    }
    if (!customForm.endpoint.trim()) {
      showToast("Vui lòng nhập Endpoint URL", "error");
      return;
    }

    setIsSavingCustom(true);
    try {
      const res = await createAdminApiProvider({
        name: customForm.name,
        desc: customForm.desc || "Nguồn API đồng bộ tùy chỉnh",
        endpoint: customForm.endpoint,
        category: customForm.category,
        apiKey: customForm.apiKey || undefined,
        isEnabled: true,
      });

      if (res.success && res.data) {
        setProviders((prev) => [...prev, res.data]);
        showToast(`Đã thêm nguồn API ${res.data.name} thành công!`);
        setIsAddProviderOpen(false);
        setCustomForm({
          name: "",
          desc: "",
          endpoint: "",
          category: "custom",
          apiKey: "",
        });
        setTestResult(null);
        loadLiveSyncStatus();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        showToast(
          "Phiên đăng nhập Admin đã hết hạn (401). Vui lòng tải lại trang hoặc đăng nhập lại!",
          "error",
        );
      } else {
        showToast(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Lỗi khi thêm nguồn API",
          "error",
        );
      }
    } finally {
      setIsSavingCustom(false);
    }
  };

  const handleAddPreset = async (preset) => {
    if (
      providers.some(
        (p) =>
          p.id === preset.id ||
          p.name.toLowerCase() === preset.name.toLowerCase(),
      )
    ) {
      showToast(
        `Nguồn API "${preset.name}" đã tồn tại trong danh sách!`,
        "error",
      );
      return;
    }

    setIsSavingCustom(true);
    try {
      const res = await createAdminApiProvider({
        name: preset.name,
        desc: preset.desc,
        endpoint: preset.endpoint,
        category: preset.category,
        isEnabled: true,
      });

      if (res.success && res.data) {
        setProviders((prev) => [...prev, res.data]);
        showToast(`Đã kích hoạt nguồn "${preset.name}" vào hệ thống!`);
        setIsAddProviderOpen(false);
        loadLiveSyncStatus();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        showToast(
          "Phiên đăng nhập Admin đã hết hạn (401). Vui lòng tải lại trang hoặc đăng nhập lại!",
          "error",
        );
      } else {
        showToast(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Lỗi khi thêm nguồn API",
          "error",
        );
      }
    } finally {
      setIsSavingCustom(false);
    }
  };

  // Filtered providers list for Tab 2
  const filteredProviders = providers.filter((p) => {
    if (!providerSearch.trim()) return true;
    const q = providerSearch.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.desc?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.endpoint?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 ${
        isDark ? "bg-black/30 text-white" : "bg-slate-900/30 text-slate-800"
      }`}
    >
      {/* Toast Notification inside Modal */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-[120] px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-150 ${
            toastMessage.type === "error"
              ? "bg-rose-950/95 text-rose-100 border-rose-500/40"
              : "bg-emerald-950/95 text-emerald-100 border-emerald-500/40"
          }`}
        >
          {toastMessage.type === "error" ? (
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.msg}</span>
        </div>
      )}

      {/* Main Glassmorphism Modal Card */}
      <div
        className={`w-full max-w-3xl backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300 ${
          isDark
            ? "bg-[#0c1630]/95 border-cyan-500/30 text-white shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_45px_rgba(6,182,212,0.18)]"
            : "bg-white/95 border-slate-200 text-slate-900 shadow-2xl"
        }`}
      >
        {/* ── 1. MODAL HEADER ── */}
        <div
          className={`px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md shrink-0 ${
            isDark
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          {isAddProviderOpen ? (
            /* Header in Add Provider View */
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProviderOpen(false)}
                  className={`px-3 py-1.5 rounded-md border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm ${
                    isDark
                      ? "bg-white/10 hover:bg-white/20 border-white/20 text-cyan-300"
                      : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-cyan-700"
                  }`}
                >
                  <ArrowLeft size={14} />
                  <span>Quay lại</span>
                </button>
                <div className="h-4 w-[1px] bg-white/15" />
                <div>
                  <h2
                    className={`text-base sm:text-lg font-black font-heading tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    Thêm Nguồn API Mới
                  </h2>
                  <p className="text-[11px] text-cyan-300/80 font-medium">
                    Chọn nguồn gợi ý quốc tế hoặc cấu hình REST Endpoint tùy
                    chỉnh
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
                  isDark
                    ? "bg-white/5 hover:bg-white/15 border-white/10 text-white/70 hover:text-white"
                    : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-900"
                }`}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            /* Normal Header with Active Tab Switcher & Close */
            <>
              <div className="flex items-center gap-3">
                <div>
                  <h2
                    className={`text-base sm:text-xl font-bold font-heading tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    Đồng bộ & Quản lý Nguồn API
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* Tab Pills */}
                <div
                  className={`flex items-center p-1 rounded-xl border ${isDark ? "bg-black/30 border-white/10" : "bg-slate-200/60 border-slate-300"}`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab("sync")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "sync"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                        : isDark
                          ? "text-slate-300 hover:text-white"
                          : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Activity size={13} />
                    <span>Trạng thái</span>
                    {failedSpecies.length > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-black">
                        {failedSpecies.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("providers")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "providers"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                        : isDark
                          ? "text-slate-300 hover:text-white"
                          : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Database size={13} />
                    <span>Nguồn API</span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
                    isDark
                      ? "bg-white/5 hover:bg-white/15 border-white/10 text-white/70 hover:text-white"
                      : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <X size={18} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── 2. MODAL BODY: INLINE ADD PROVIDER VIEW ── */}
        {isAddProviderOpen ? (
          <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
            {/* Sub-tabs: Catalog vs Custom */}
            <div
              className={`flex items-center p-1 rounded-xl border ${
                isDark
                  ? "bg-black/30 border-white/10"
                  : "bg-slate-200/60 border-slate-300"
              }`}
            >
              <button
                type="button"
                onClick={() => setAddMode("catalog")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${
                  addMode === "catalog"
                    ? "bg-blue-200 text-black border border-blue-700"
                    : isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Gợi ý Nguồn Mở Quốc Tế</span>
              </button>
              <button
                type="button"
                onClick={() => setAddMode("custom")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  addMode === "custom"
                    ? "bg-blue-200 text-black border border-blue-700"
                    : isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Tùy Chỉnh</span>
              </button>
            </div>

            {/* Mode 1: Catalog Presets */}
            {addMode === "catalog" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CATALOG_PRESETS.map((item) => {
                  const isExisting = providers.some(
                    (p) =>
                      p.id === item.id ||
                      p.name.toLowerCase() === item.name.toLowerCase(),
                  );
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all duration-200 ${
                        isDark
                          ? "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-cyan-400/40"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100/80 hover:border-cyan-500/40"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h5
                            className={`text-sm sm:text-base font-bold line-clamp-1 ${isDark ? "text-white" : "text-slate-900"}`}
                          >
                            {item.name}
                          </h5>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold border shrink-0 ${CATEGORY_LABELS[item.category]?.color}`}
                          >
                            {CATEGORY_LABELS[item.category]?.label}
                          </span>
                        </div>
                        <p
                          className={`text-xs leading-relaxed line-clamp-2 ${isDark ? "text-slate-300/80" : "text-slate-600"}`}
                        >
                          {item.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddPreset(item)}
                        disabled={isExisting || isSavingCustom}
                        className={`w-full py-2 rounded-lg text-sm font-bold transition-all cursor-pointer active:scale-95 shadow-sm flex items-center justify-center gap-1.5 ${
                          isExisting
                            ? isDark
                              ? "bg-slate-800/60 text-slate-400 border border-white/10 cursor-not-allowed shadow-none"
                              : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {isExisting
                          ? "Đã có trong hệ thống"
                          : "Kích hoạt nguồn này"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mode 2: Custom REST API Form */}
            {addMode === "custom" && (
              <div className="space-y-3.5 max-w-2xl mx-auto">
                <div>
                  <label
                    className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Tên Nguồn API <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên nguồn API..."
                    value={customForm.name}
                    onChange={(e) =>
                      setCustomForm({ ...customForm, name: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white/10"
                        : "bg-slate-50 border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Endpoint URL (REST API){" "}
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://api.example.org/v1/species?q=..."
                    value={customForm.endpoint}
                    onChange={(e) =>
                      setCustomForm({ ...customForm, endpoint: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white/10"
                        : "bg-slate-50 border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-200" : "text-slate-700"}`}
                    >
                      Danh mục
                    </label>
                    <CustomCategorySelect
                      options={CATEGORY_OPTIONS}
                      value={customForm.category}
                      onChange={(val) =>
                        setCustomForm({ ...customForm, category: val })
                      }
                      isDark={isDark}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-200" : "text-slate-700"}`}
                    >
                      API Key / Token (Tùy chọn)
                    </label>
                    <input
                      type="password"
                      placeholder="Bearer token / key..."
                      value={customForm.apiKey}
                      onChange={(e) =>
                        setCustomForm({ ...customForm, apiKey: e.target.value })
                      }
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                        isDark
                          ? "bg-white/5 border border-white/15 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white/10"
                          : "bg-slate-50 border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-200" : "text-slate-700"}`}
                  >
                    Mô tả tóm tắt
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả chức năng hoặc phạm vi dữ liệu của nguồn API này..."
                    value={customForm.desc}
                    onChange={(e) =>
                      setCustomForm({ ...customForm, desc: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition-all resize-none ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white/10"
                        : "bg-slate-50 border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
                    }`}
                  />
                </div>

                {/* Ping Test Live Result before save */}
                {testResult && (
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      testResult.success
                        ? isDark
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                          : "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : isDark
                          ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                          : "bg-rose-50 border-rose-300 text-rose-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {testResult.success ? (
                        <CheckCircle2 size={14} className="shrink-0" />
                      ) : (
                        <AlertCircle size={14} className="shrink-0" />
                      )}
                      <span>
                        {testResult.message ||
                          (testResult.success
                            ? "Kết nối thành công!"
                            : "Không kết nối được")}
                      </span>
                    </div>
                    {testResult.responseTimeMs && (
                      <span className="font-mono text-[10px] font-bold shrink-0">
                        {testResult.responseTimeMs}ms
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleTestCustomEndpoint}
                    disabled={isTestingCustom || !customForm.endpoint.trim()}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50 ${
                      isDark
                        ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                        : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                    }`}
                  >
                    {isTestingCustom ? (
                      <Loader2
                        size={13}
                        className="animate-spin text-cyan-400"
                      />
                    ) : (
                      <Zap size={13} className="text-cyan-400" />
                    )}
                    <span>Kiểm tra kết nối</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCustomProvider}
                    disabled={
                      isSavingCustom ||
                      !customForm.name.trim() ||
                      !customForm.endpoint.trim()
                    }
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingCustom ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    <span>Lưu Nguồn API</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── 3. MODAL BODY: TAB 1 OR TAB 2 ── */
          <>
            {activeTab === "sync" && (
              <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                {/* Active API Status Cards */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? "text-cyan-300" : "text-cyan-700"}`}
                      >
                        <Zap size={15} />
                        <span>
                          Nguồn API đang hoạt động: {apiStatuses.length}
                        </span>
                      </h3>
                      {isLoadingStatus && (
                        <Loader2
                          size={13}
                          className="animate-spin text-cyan-400"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {apiStatuses.map((api, index) => (
                      <div
                        key={index}
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-2.5 shadow-sm transition-all ${
                          isDark
                            ? "bg-white/5 border-white/15 hover:border-cyan-400/40"
                            : "bg-slate-50 border-slate-200 hover:border-cyan-500/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-xs sm:text-sm font-bold line-clamp-1 ${isDark ? "text-white" : "text-slate-900"}`}
                          >
                            {api.name}
                          </span>
                          {api.responseTimeMs && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-400/20 shrink-0">
                              {api.responseTimeMs}ms
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {api.status === "ok" ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] shrink-0" />
                          ) : api.status === "slow" ? (
                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] shrink-0" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] shrink-0" />
                          )}
                          <span
                            className={`text-[11px] font-medium leading-tight line-clamp-1 ${
                              api.status === "ok"
                                ? isDark
                                  ? "text-emerald-300"
                                  : "text-emerald-600"
                                : api.status === "slow"
                                  ? isDark
                                    ? "text-amber-300"
                                    : "text-amber-600"
                                  : isDark
                                    ? "text-rose-300"
                                    : "text-rose-600"
                            }`}
                          >
                            {api.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Incomplete / Sync Failed Species List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3
                        className={`text-sm font-bold ${isDark ? "text-cyan-300" : "text-cyan-700"}`}
                      >
                        Sinh vật có dữ liệu lỗi từ API
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Tự động tìm kiếm ảnh & thông số còn thiếu từ các API
                        quốc tế
                      </p>
                    </div>

                    {failedSpecies.length > 0 && (
                      <button
                        type="button"
                        onClick={handleSyncAllClick}
                        disabled={isSyncingAll}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
                      >
                        {isSyncingAll ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <RefreshCw size={13} />
                        )}
                        <span>Đồng bộ tất cả</span>
                      </button>
                    )}
                  </div>

                  {failedSpecies.length > 0 ? (
                    <div className="space-y-2.5">
                      {failedSpecies.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-sm transition-all ${
                            isDark
                              ? "bg-white/5 border-white/15 hover:border-white/30"
                              : "bg-slate-50 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-sm shrink-0"
                            />
                            <div>
                              <h4
                                className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                              >
                                {item.name}
                              </h4>
                              <span className="text-xs text-rose-400 font-medium">
                                {item.error}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRetryItem(item.id)}
                            disabled={retryingId === item.id}
                            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95 ${
                              isDark
                                ? "bg-white/10 hover:bg-white/20 border-white/15 text-white"
                                : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
                            }`}
                          >
                            {retryingId === item.id ? (
                              <Loader2
                                size={12}
                                className="animate-spin text-cyan-400"
                              />
                            ) : (
                              <>
                                <RefreshCw
                                  size={12}
                                  className="text-cyan-400"
                                />
                                <span>Thử lại</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={`p-6 rounded-2xl border text-center space-y-1.5 shadow-md ${
                        isDark
                          ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200"
                          : "bg-emerald-50 border-emerald-200 text-emerald-700"
                      }`}
                    >
                      <CheckCircle2
                        size={24}
                        className={`mx-auto ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                      />
                      <p className="text-sm font-bold">
                        Tất cả sinh vật đã được đồng bộ dữ liệu thành công!
                      </p>
                      <p className="text-xs opacity-80">
                        Cơ sở dữ liệu Pacific đã có đầy đủ hình ảnh & thông số
                        phân loại sinh học.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: API PROVIDERS MANAGEMENT */}
            {activeTab === "providers" && (
              <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                {/* Actions Bar: Search + Add New API + Ping All */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-300/70"
                    />
                    <input
                      type="text"
                      placeholder="Tìm nguồn API theo tên, danh mục..."
                      value={providerSearch}
                      onChange={(e) => setProviderSearch(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                        isDark
                          ? "bg-black/30 border border-white/15 text-white placeholder:text-slate-400 focus:border-cyan-400"
                          : "bg-slate-100 border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-cyan-500"
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => loadProvidersList(true)}
                      disabled={isLoadingProviders}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                        isDark
                          ? "bg-white/5 hover:bg-white/15 border-white/15 text-slate-300 hover:text-white"
                          : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                      }`}
                      title="Kiểm tra độ trễ (Ping) tất cả API"
                    >
                      {isLoadingProviders ? (
                        <Loader2
                          size={13}
                          className="animate-spin text-cyan-400"
                        />
                      ) : (
                        <Activity size={13} className="text-cyan-400" />
                      )}
                      <span>Ping tất cả</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAddProviderOpen(true);
                        setTestResult(null);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Thêm nguồn API</span>
                    </button>
                  </div>
                </div>

                {/* Providers Grid */}
                <div className="space-y-3">
                  {filteredProviders.map((prov) => {
                    const catInfo =
                      CATEGORY_LABELS[prov.category] || CATEGORY_LABELS.custom;
                    const isTesting = testingId === prov.id;
                    const isToggling = togglingId === prov.id;
                    const isDeleting = deletingId === prov.id;

                    return (
                      <div
                        key={prov.id}
                        className={`p-4 rounded-2xl border transition-all duration-200 ${
                          !prov.isEnabled
                            ? isDark
                              ? "bg-black/20 border-white/5 opacity-60"
                              : "bg-slate-100/60 border-slate-200 opacity-60"
                            : isDark
                              ? "bg-white/5 border-white/15 hover:border-cyan-400/40"
                              : "bg-white border-slate-200 hover:border-cyan-500/40 shadow-sm"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Left: Info & Badges */}
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4
                                className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                              >
                                {prov.name}
                              </h4>

                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${catInfo.color}`}
                              >
                                {catInfo.label}
                              </span>

                              {prov.isBuiltIn ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/15 text-blue-300 border border-blue-400/20">
                                  Hệ thống
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-pink-500/15 text-pink-300 border border-pink-400/20">
                                  Tùy chỉnh
                                </span>
                              )}

                              {prov.requiresKey && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-400/20">
                                  API Key
                                </span>
                              )}
                            </div>

                            <p
                              className={`text-xs leading-relaxed line-clamp-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}
                            >
                              {prov.desc}
                            </p>

                            <div className="flex items-center gap-2 text-[11px] text-cyan-400/80 font-mono line-clamp-1">
                              <span className="truncate">{prov.endpoint}</span>
                            </div>
                          </div>

                          {/* Right: Toggle Switch & Action Buttons */}
                          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                            {/* Ping Indicator / Test button */}
                            {prov.isEnabled && (
                              <button
                                type="button"
                                onClick={() => handleTestProvider(prov)}
                                disabled={isTesting}
                                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                  isDark
                                    ? "bg-white/10 hover:bg-white/20 border-white/15 text-slate-200"
                                    : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                                }`}
                                title="Kiểm tra kết nối tới API này"
                              >
                                {isTesting ? (
                                  <Loader2
                                    size={11}
                                    className="animate-spin text-cyan-400"
                                  />
                                ) : (
                                  <Zap size={11} className="text-cyan-400" />
                                )}
                                <span>
                                  {prov.responseTimeMs
                                    ? `${prov.responseTimeMs}ms`
                                    : "Test"}
                                </span>
                              </button>
                            )}

                            {/* Enable/Disable Toggle Switch */}
                            <label
                              className={`relative inline-flex items-center cursor-pointer ${
                                isToggling
                                  ? "opacity-50 pointer-events-none"
                                  : ""
                              }`}
                              title={
                                prov.isEnabled
                                  ? "Bấm để TẮT nguồn API này"
                                  : "Bấm để BẬT nguồn API này"
                              }
                            >
                              <input
                                type="checkbox"
                                checked={Boolean(prov.isEnabled)}
                                onChange={() => handleToggleProvider(prov)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:to-blue-600 shadow-inner"></div>
                            </label>

                            {/* Delete button (For custom APIs or non-core) */}
                            {!prov.isBuiltIn && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteProvider(prov.id, prov.name)
                                }
                                disabled={isDeleting}
                                className={`p-1.5 rounded-xl border transition-all cursor-pointer text-rose-400 hover:text-rose-300 ${
                                  isDark
                                    ? "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30"
                                    : "bg-rose-50 hover:bg-rose-100 border-rose-200"
                                }`}
                                title="Xóa nguồn API này"
                              >
                                {isDeleting ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredProviders.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      Không tìm thấy nguồn API nào khớp với từ khóa tìm kiếm.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── 4. MODAL FOOTER ── */}
        <div
          className={`px-6 py-3.5 border-t flex items-center justify-between backdrop-blur-md shrink-0 ${
            isDark
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <span className="text-[11px] text-slate-400">
            {isAddProviderOpen
              ? addMode === "catalog"
                ? "Chọn nhanh từ danh mục nguồn dữ liệu quốc tế"
                : "Nhập endpoint REST API để tích hợp nguồn mới vào hệ thống"
              : activeTab === "sync"
                ? `Hệ thống hỗ trợ ${apiStatuses.length} nguồn dữ liệu mở quốc tế`
                : `Đang kích hoạt ${providers.filter((p) => p.isEnabled).length} / ${providers.length} nguồn dữ liệu`}
          </span>

          <div className="flex items-center gap-2">
            {isAddProviderOpen ? (
              <button
                type="button"
                onClick={() => setIsAddProviderOpen(false)}
                className={`px-5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20 border-white/15 text-white"
                    : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                }`}
              >
                Hủy / Quay lại
              </button>
            ) : (
              <button
                onClick={onClose}
                className={`px-5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20 border-white/15 text-white"
                    : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                }`}
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
