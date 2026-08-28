import { Fragment } from "react";
import { CheckSquare, Square, Loader2 } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import SpeciesExpandedDetail from "./SpeciesExpandedDetail";
import SpeciesPaginationFooter from "./SpeciesPaginationFooter";

export default function SpeciesTable({
  isLoading,
  filteredList,
  totalCount,
  selectedRowId,
  setSelectedRowId,
  checkedIds,
  handleToggleCheckAll,
  handleToggleCheckRow,
  selectedSpecies,
  activeDetailTab,
  setActiveDetailTab,
  handleOpenEditModal,
  handleToggleVisibility,
  handleDelete,
}) {
  const { isDark } = useTheme();

  return (
    <div
      className={`border rounded-3xl overflow-hidden shadow-2xl w-full flex flex-col justify-between h-[calc(100vh-120px)] min-h-[620px] relative transition-colors duration-300 ${
        isDark
          ? "bg-[#142144]/90 backdrop-blur-xl border-white/15"
          : "bg-white border-slate-200 shadow-md"
      }`}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs ${
            isDark ? "bg-[#142144]/60" : "bg-white/60"
          }`}
        >
          <Loader2 size={24} className="text-cyan-400 animate-spin" />
        </div>
      )}

      {/* Scrollable Table Area */}
      <div className="overflow-x-auto overflow-y-auto w-full flex-1 custom-scrollbar">
        <table className="w-full text-left text-sm border-collapse table-fixed min-w-[850px]">
          {/* Table Header */}
          <thead>
            <tr
              className={`font-bold border-b text-sm ${
                isDark
                  ? "bg-[#1e2f5c] text-white border-white/15"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <th className="p-3.5 w-10 text-center">
                <button
                  onClick={handleToggleCheckAll}
                  className={`cursor-pointer ${
                    isDark
                      ? "text-white/60 hover:text-white"
                      : "text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {checkedIds.length === filteredList.length &&
                  filteredList.length > 0 ? (
                    <CheckSquare size={14} className="text-cyan-400" />
                  ) : (
                    <Square size={14} />
                  )}
                </button>
              </th>
              <th className="p-3.5 w-[14%]">Mã sinh vật</th>
              <th className="p-3.5 w-[20%]">Tên sinh vật</th>
              <th className="p-3.5 w-[16%]">Mã định danh</th>
              <th className="p-3.5 w-[11%] whitespace-nowrap">Nguồn dữ liệu</th>
              <th className="p-3.5 w-[10%] whitespace-nowrap">Vị trí</th>
              <th className="p-3.5 w-[12%] whitespace-nowrap">Bảo tồn</th>
              <th className="p-3.5 w-[9%] whitespace-nowrap">Lượt xem</th>
              <th className="p-3.5 w-[12%] text-right whitespace-nowrap">
                Trạng thái
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody
            className={`divide-y font-medium ${
              isDark
                ? "divide-white/10 text-white/90"
                : "divide-slate-200 text-slate-800"
            }`}
          >
            {filteredList.map((item) => {
              const isExpanded = selectedRowId === item.id;
              const isChecked = checkedIds.includes(item.id);

              return (
                <Fragment key={item.id}>
                  <tr
                    onClick={() =>
                      setSelectedRowId(isExpanded ? null : item.id)
                    }
                    className={`transition-colors cursor-pointer ${
                      isExpanded
                        ? isDark
                          ? "bg-[#25396e] border-l-4 border-cyan-400 font-semibold"
                          : "bg-cyan-50/80 border-l-4 border-cyan-500 font-semibold text-slate-900"
                        : isDark
                          ? "hover:bg-white/5"
                          : "hover:bg-slate-50"
                    }`}
                  >
                    <td
                      className="p-3.5 text-center"
                      onClick={(e) => handleToggleCheckRow(item.id, e)}
                    >
                      {isChecked ? (
                        <CheckSquare size={14} className="text-cyan-400" />
                      ) : (
                        <Square
                          size={14}
                          className={
                            isDark ? "text-white/40" : "text-slate-300"
                          }
                        />
                      )}
                    </td>
                    <td
                      className={`p-3.5 font-mono font-bold truncate ${
                        isDark ? "text-cyan-300" : "text-cyan-700"
                      }`}
                    >
                      {item.code}
                    </td>
                    <td
                      className={`p-3.5 font-bold truncate ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {item.name || "Cá mập trắng"}
                    </td>
                    <td
                      className={`p-3.5 font-mono truncate ${
                        isDark ? "text-white/60" : "text-slate-500"
                      }`}
                    >
                      {item.gbifId}
                    </td>
                    <td className="p-3.5 font-semibold truncate">
                      {item.source}
                    </td>
                    <td className="p-3.5 truncate">{item.location}</td>
                    <td className="p-3.5 truncate">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.conservationCode === "CR"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                            : item.conservationCode === "EN"
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        }`}
                      >
                        {item.conservation}
                      </span>
                    </td>
                    <td
                      className={`p-3.5 font-mono truncate ${
                        isDark ? "text-white/70" : "text-slate-600"
                      }`}
                    >
                      {(item.views || 0).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right truncate">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.is_visible
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>

                  {/* ── EXPANDED ROW DETAIL PANEL ── */}
                  {isExpanded && (
                    <SpeciesExpandedDetail
                      selectedSpecies={selectedSpecies}
                      activeDetailTab={activeDetailTab}
                      setActiveDetailTab={setActiveDetailTab}
                      handleOpenEditModal={handleOpenEditModal}
                      handleToggleVisibility={handleToggleVisibility}
                      handleDelete={handleDelete}
                    />
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Integrated Pagination Footer Bar inside Table Container */}
      <SpeciesPaginationFooter
        filteredCount={filteredList.length}
        totalCount={totalCount}
      />
    </div>
  );
}
