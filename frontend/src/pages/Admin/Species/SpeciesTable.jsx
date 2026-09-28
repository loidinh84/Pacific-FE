import { Fragment } from "react";
import {
  CheckSquare,
  Square,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Fish,
  RotateCcw,
  Plus,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import SpeciesExpandedDetail from "./SpeciesExpandedDetail";
import SpeciesPaginationFooter from "./SpeciesPaginationFooter";

export default function SpeciesTable({
  isLoading = false,
  filteredList = [],
  totalCount = 0,
  selectedRowId = null,
  setSelectedRowId = () => {},
  checkedIds = [],
  handleToggleCheckAll = () => {},
  handleToggleCheckRow = () => {},
  selectedSpecies = null,
  activeDetailTab = "info",
  setActiveDetailTab = () => {},
  handleOpenEditModal = () => {},
  handleToggleVisibility = () => {},
  handleDelete = () => {},
  // Sorting props
  sortBy = null,
  sortOrder = "asc",
  onSort = () => {},
  // Filter reset & Add modal props for Empty state
  onResetFilters = null,
  onOpenAddModal = null,
  hasActiveFilters = false,
  // Pagination props
  page = 1,
  totalPages = 1,
  perPage = 20,
  onPageChange = () => {},
  onPerPageChange = () => {},
}) {
  const { isDark } = useTheme();

  // Helper render sort icon
  const renderSortIcon = (columnKey) => {
    if (sortBy === columnKey) {
      return sortOrder === "asc" ? (
        <ArrowUp size={14} className="text-cyan-400 shrink-0" />
      ) : (
        <ArrowDown size={14} className="text-cyan-400 shrink-0" />
      );
    }
    return (
      <ArrowUpDown
        size={13}
        className={`shrink-0 opacity-40 group-hover:opacity-100 transition-opacity ${
          isDark ? "text-white/50" : "text-slate-400"
        }`}
      />
    );
  };

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
          <Loader2 size={28} className="text-cyan-400 animate-spin" />
        </div>
      )}

      {/* Scrollable Table Area */}
      <div className="overflow-x-auto overflow-y-auto w-full flex-1 custom-scrollbar">
        <table className="w-full text-left text-sm border-collapse table-fixed min-w-[880px]">
          {/* Table Header with Interactive Column Sorting */}
          <thead className="sticky top-0 z-10">
            <tr
              className={`font-bold border-b text-sm select-none ${
                isDark
                  ? "bg-[#1b2b54] text-white border-white/15 shadow-sm"
                  : "bg-slate-100 text-slate-700 border-slate-200 shadow-sm"
              }`}
            >
              {/* Checkbox Column */}
              <th className="p-3.5 w-10 text-center">
                <button
                  onClick={handleToggleCheckAll}
                  className={`cursor-pointer ${
                    isDark
                      ? "text-white/60 hover:text-white"
                      : "text-slate-400 hover:text-slate-900"
                  }`}
                  title={
                    checkedIds.length === filteredList.length && filteredList.length > 0
                      ? "Bỏ chọn tất cả"
                      : "Chọn tất cả"
                  }
                >
                  {checkedIds.length === filteredList.length &&
                  filteredList.length > 0 ? (
                    <CheckSquare size={15} className="text-cyan-400" />
                  ) : (
                    <Square size={15} />
                  )}
                </button>
              </th>

              {/* Mã sinh vật */}
              <th className="p-3.5 w-[14%]">
                <button
                  onClick={() => onSort("code")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-cyan-400 transition-colors"
                >
                  <span className={sortBy === "code" ? "text-cyan-400" : ""}>Mã sinh vật</span>
                  {renderSortIcon("code")}
                </button>
              </th>

              {/* Tên sinh vật */}
              <th className="p-3.5 w-[20%]">
                <button
                  onClick={() => onSort("name")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-cyan-400 transition-colors"
                >
                  <span className={sortBy === "name" ? "text-cyan-400" : ""}>Tên sinh vật</span>
                  {renderSortIcon("name")}
                </button>
              </th>

              {/* Mã định danh (GBIF/Slug) */}
              <th className="p-3.5 w-[16%]">
                <button
                  onClick={() => onSort("gbifId")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-cyan-400 transition-colors"
                >
                  <span className={sortBy === "gbifId" ? "text-cyan-400" : ""}>Mã định danh</span>
                  {renderSortIcon("gbifId")}
                </button>
              </th>

              {/* Nguồn dữ liệu */}
              <th className="p-3.5 w-[11%] whitespace-nowrap">
                <button
                  onClick={() => onSort("source")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-cyan-400 transition-colors"
                >
                  <span className={sortBy === "source" ? "text-cyan-400" : ""}>Nguồn</span>
                  {renderSortIcon("source")}
                </button>
              </th>

              {/* Vị trí */}
              <th className="p-3.5 w-[10%] whitespace-nowrap">
                <button
                  onClick={() => onSort("location")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-cyan-400 transition-colors"
                >
                  <span className={sortBy === "location" ? "text-cyan-400" : ""}>Vị trí</span>
                  {renderSortIcon("location")}
                </button>
              </th>

              {/* Bảo tồn */}
              <th className="p-3.5 w-[12%] whitespace-nowrap">
                <button
                  onClick={() => onSort("conservationCode")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-cyan-400 transition-colors"
                >
                  <span className={sortBy === "conservationCode" ? "text-cyan-400" : ""}>Bảo tồn</span>
                  {renderSortIcon("conservationCode")}
                </button>
              </th>

              {/* Lượt xem */}
              <th className="p-3.5 w-[9%] whitespace-nowrap">
                <button
                  onClick={() => onSort("views")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-cyan-400 transition-colors"
                >
                  <span className={sortBy === "views" ? "text-cyan-400" : ""}>Lượt xem</span>
                  {renderSortIcon("views")}
                </button>
              </th>

              {/* Trạng thái */}
              <th className="p-3.5 w-[12%] text-right whitespace-nowrap">
                <button
                  onClick={() => onSort("is_visible")}
                  className="group flex items-center justify-end gap-1.5 cursor-pointer font-bold w-full text-right hover:text-cyan-400 transition-colors"
                >
                  <span className={sortBy === "is_visible" ? "text-cyan-400" : ""}>Trạng thái</span>
                  {renderSortIcon("is_visible")}
                </button>
              </th>
            </tr>
          </thead>

          <tbody
            className={`divide-y font-medium ${
              isDark
                ? "divide-white/10 text-white/90"
                : "divide-slate-200 text-slate-800"
            }`}
          >
            {/* Empty State Illustration */}
            {filteredList.length === 0 && !isLoading && (
              <tr>
                <td colSpan={9} className="p-10 sm:p-16 text-center">
                  <div className="max-w-md mx-auto flex flex-col items-center justify-center">
                    <div className="relative mb-5">
                      {/* Ambient circles */}
                      <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
                      <div
                        className={`relative w-20 h-20 rounded-3xl border flex items-center justify-center shadow-xl ${
                          isDark
                            ? "bg-[#182a55] border-cyan-500/30 text-cyan-400"
                            : "bg-cyan-50 border-cyan-200 text-cyan-600"
                        }`}
                      >
                        <Fish size={38} className="animate-bounce duration-1000" />
                      </div>
                    </div>

                    <h3
                      className={`text-lg sm:text-xl font-bold font-heading ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      Không tìm thấy sinh vật phù hợp
                    </h3>
                    <p
                      className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {hasActiveFilters
                        ? "Không có sinh vật nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn. Hãy thử xóa bộ lọc để xem toàn bộ danh mục."
                        : "Cơ sở dữ liệu sinh vật hiện đang trống hoặc chưa có bản ghi nào được tạo."}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                      {hasActiveFilters && onResetFilters && (
                        <button
                          onClick={onResetFilters}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/25 transition-all cursor-pointer active:scale-95"
                        >
                          <RotateCcw size={15} />
                          <span>Đặt lại bộ lọc</span>
                        </button>
                      )}

                      {onOpenAddModal && (
                        <button
                          onClick={onOpenAddModal}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
                        >
                          <Plus size={15} />
                          <span>Thêm sinh vật mới</span>
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )}

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
                      {item.name || item.scientificName || "Sinh vật biển"}
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
        page={page}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
      />
    </div>
  );
}
