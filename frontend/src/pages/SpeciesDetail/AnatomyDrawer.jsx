import { useCallback } from "react";
import {
  X,
  Copy,
  Check,
  Activity,
  BookOpen,
  Microscope,
  Scale,
} from "lucide-react";
import { SYSTEM_CONFIG } from "./anatomyConfig";

// ─── System Badge ──────────────────────────────────────────────────────────────
function SystemBadge({ system, language }) {
  const cfg = SYSTEM_CONFIG[system] || SYSTEM_CONFIG.nervous;
  const label = language === "en" ? cfg.labelEn : cfg.labelVi;
  const Icon = cfg.Icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{
        backgroundColor: cfg.color + "22",
        color: cfg.color,
        border: `1px solid ${cfg.color}55`,
      }}
    >
      {Icon && <Icon size={10} />}
      {label}
    </span>
  );
}

// ─── Medical Data Row ──────────────────────────────────────────────────────────
function MedRow({ icon: Icon, label, value, highlight }) {
  return (
    <div
      className={`flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0 ${
        highlight ? "bg-white/3 -mx-4 px-4 rounded-lg" : ""
      }`}
    >
      <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center">
        <Icon size={13} className="text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
          {label}
        </p>
        <p className="text-sm text-slate-200 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

// ─── Anatomy Drawer ────────────────────────────────────────────────────────────
/**
 * Slide-in panel showing detailed medical data for the selected organ.
 * @param {object}   organ      - The active organ object from anatomy data
 * @param {string}   language   - "vi" | "en"
 * @param {string}   copiedId   - ID of organ whose Latin name was just copied
 * @param {Function} onCopy     - (organ, event) => void
 * @param {Function} onClose    - () => void
 * @param {object}   ref        - forwarded ref for click-outside detection
 */
export function AnatomyDrawer({
  organ,
  language,
  copiedId,
  onCopy,
  onClose,
  drawerRef,
}) {
  const sysCfg = SYSTEM_CONFIG[organ?.system] || SYSTEM_CONFIG.nervous;
  const isCopied = copiedId === organ?.id;

  const getLabel = useCallback(
    (o) => (language === "en" ? o?.labelEn || o?.labelVi : o?.labelVi),
    [language]
  );

  return (
    <div
      ref={drawerRef}
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        maxHeight: organ ? "600px" : "0",
        opacity: organ ? 1 : 0,
        marginTop: organ ? "12px" : "0",
      }}
    >
      {organ && (
        <div
          className="rounded-2xl border border-white/10 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,27,62,0.9) 0%, rgba(7,16,35,0.95) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-start justify-between gap-4 p-5 border-b border-white/8"
            style={{
              borderLeftWidth: "3px",
              borderLeftColor: sysCfg.color,
              borderLeftStyle: "solid",
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <SystemBadge system={organ.system} language={language} />
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {getLabel(organ)}
              </h3>
              {organ.latinName && (
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-sm italic"
                    style={{
                      color: sysCfg.color,
                      userSelect: "text",
                      WebkitUserSelect: "text",
                      cursor: "text",
                    }}
                  >
                    {organ.latinName}
                  </span>
                  <button
                    onClick={(e) => onCopy(organ, e)}
                    className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border border-white/10 text-slate-400 hover:text-white hover:border-white/25 transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check size={10} className="text-emerald-400" />
                        <span className="text-emerald-400">
                          {language === "vi" ? "Đã sao chép" : "Copied!"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy size={10} />
                        {language === "vi" ? "Sao chép" : "Copy"}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Đóng"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 grid md:grid-cols-2 gap-5">
            {/* Biological description */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">
                {language === "vi" ? "Mô Tả Sinh Học" : "Biological Description"}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {language === "en" ? organ.descEn || organ.descVi : organ.descVi}
              </p>
            </div>

            {/* Medical data */}
            {organ.medicalData && (
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">
                  {language === "vi"
                    ? "Dữ Liệu Y Khoa"
                    : "Medical & Research Data"}
                </p>
                <div>
                  {organ.medicalData.weightEstimate && (
                    <MedRow
                      icon={Scale}
                      label={
                        language === "vi" ? "Khối lượng ước tính" : "Est. weight"
                      }
                      value={organ.medicalData.weightEstimate}
                    />
                  )}
                  <MedRow
                    icon={Activity}
                    label={language === "vi" ? "Chức năng" : "Function"}
                    value={
                      language === "en"
                        ? organ.medicalData.functionEn || organ.medicalData.functionVi
                        : organ.medicalData.functionVi
                    }
                  />
                  <MedRow
                    icon={Microscope}
                    label={
                      language === "vi"
                        ? "Ứng dụng y học / dược học"
                        : "Medical / Pharmaceutical Use"
                    }
                    value={
                      language === "en"
                        ? organ.medicalData.medicalUseEn ||
                          organ.medicalData.medicalUseVi
                        : organ.medicalData.medicalUseVi
                    }
                    highlight
                  />
                  {organ.medicalData.source && (
                    <MedRow
                      icon={BookOpen}
                      label={language === "vi" ? "Nguồn tài liệu" : "Source"}
                      value={organ.medicalData.source}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
