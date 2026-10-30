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
  Eye,
  Pencil,
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
        <ArrowUp size={14} className="text-sky-400 shrink-0" />
      ) : (
        <ArrowDown size={14} className="text-sky-400 shrink-0" />
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
          <Loader2 size={28} className="text-sky-400 animate-spin" />
        </div>
      )}

      {/* Scrollable Table Area */}
      <div className="overflow-x-auto overflow-y-auto w-full flex-1 custom-scrollbar">
        <table className="w-full text-left text-sm border-collapse table-fixed">
          {/* Table Header with Interactive Column Sorting */}
          <thead className={`sticky top-0 z-10 ${isDark ? "bg-[#1b2b54]" : "bg-slate-100"}`}>
            <tr
              className={`font-bold border-b text-sm select-none ${
                isDark
                  ? "bg-[#1b2b54] text-white border-white/15 shadow-sm"
                  : "bg-slate-100 text-slate-700 border-slate-200 shadow-sm"
              }`}
            >
              {/* Checkbox Column */}
              <th className="px-2 py-3.5 w-[4%] min-w-10 text-center bg-inherit">
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
                    <CheckSquare size={15} className="text-sky-400" />
                  ) : (
                    <Square size={15} />
                  )}
                </button>
              </th>

              {/* Mã sinh vật */}
              <th className="px-2.5 py-3.5 w-[13%] bg-inherit">
                <button
                  onClick={() => onSort("code")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-sky-300 transition-colors"
                >
                  <span className={sortBy === "code" ? "text-sky-300" : ""}>Mã sinh vật</span>
                  {renderSortIcon("code")}
                </button>
              </th>

              {/* Tên sinh vật */}
              <th className="px-2.5 py-3.5 w-[19%] bg-inherit">
                <button
                  onClick={() => onSort("name")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-sky-300 transition-colors"
                >
                  <span className={sortBy === "name" ? "text-sky-300" : ""}>Tên sinh vật</span>
                  {renderSortIcon("name")}
                </button>
              </th>

              {/* Mã định danh */}
              <th className="px-2.5 py-3.5 w-[13%] bg-inherit">
                <button
                  onClick={() => onSort("gbifId")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-sky-300 transition-colors"
                >
                  <span className={sortBy === "gbifId" ? "text-sky-300" : ""}>Mã định danh</span>
                  {renderSortIcon("gbifId")}
                </button>
              </th>

              {/* Nguồn dữ liệu */}
              <th className="px-2.5 py-3.5 w-[9%] whitespace-nowrap bg-inherit">
                <button
                  onClick={() => onSort("source")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-sky-300 transition-colors"
                >
                  <span className={sortBy === "source" ? "text-sky-300" : ""}>Nguồn</span>
                  {renderSortIcon("source")}
                </button>
              </th>

              {/* Vị trí */}
              <th className="px-2.5 py-3.5 w-[8%] whitespace-nowrap bg-inherit">
                <button
                  onClick={() => onSort("location")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-sky-300 transition-colors"
                >
                  <span className={sortBy === "location" ? "text-sky-300" : ""}>Vị trí</span>
                  {renderSortIcon("location")}
                </button>
              </th>

              {/* Bảo tồn */}
              <th className="px-2.5 py-3.5 w-[11%] whitespace-nowrap bg-inherit">
                <button
                  onClick={() => onSort("conservationCode")}
                  className="group flex items-center gap-1.5 cursor-pointer font-bold w-full text-left hover:text-sky-300 transition-colors"
                >
                  <span className={sortBy === "conservationCode" ? "text-sky-300" : ""}>Bảo tồn</span>
                  {renderSortIcon("conservationCode")}
                </button>
              </th>

              {/* Lượt xem */}
              <th className="px-2 py-3.5 w-[7%] text-center whitespace-nowrap bg-inherit">
                <button
                  onClick={() => onSort("views")}
                  className="group flex items-center justify-center gap-1.5 cursor-pointer font-bold w-full text-center hover:text-sky-300 transition-colors"
                >
                  <span className={sortBy === "views" ? "text-sky-300" : ""}>Lượt xem</span>
                  {renderSortIcon("views")}
                </button>
              </th>

              {/* Trạng thái */}
              <th className="px-2.5 py-3.5 w-[9%] text-center whitespace-nowrap bg-inherit">
                <button
                  onClick={() => onSort("is_visible")}
                  className="group flex items-center justify-center gap-1.5 cursor-pointer font-bold w-full text-center hover:text-sky-300 transition-colors"
                >
                  <span className={sortBy === "is_visible" ? "text-sky-300" : ""}>Trạng thái</span>
                  {renderSortIcon("is_visible")}
                </button>
              </th>

              {/* Thao tác */}
              <th className="px-2 py-3.5 w-[9%] min-w-[76px] text-center whitespace-nowrap bg-inherit">
                <span>Thao tác</span>
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
                <td colSpan={10} className="p-10 sm:p-16 text-center">
                  <div className="max-w-md mx-auto flex flex-col items-center justify-center">
                    <div className="relative mb-5">
                      <div
                        className={`relative w-16 h-16 rounded-2xl border flex items-center justify-center shadow-md ${
                          isDark
                            ? "bg-[#182a55] border-white/10 text-sky-400"
                            : "bg-sky-50 border-sky-200 text-sky-600"
                        }`}
                      >
                        <Fish size={32} />
                      </div>
                    </div>

                    <h2
                      className={`text-base sm:text-lg font-bold font-heading ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      Không tìm thấy sinh vật phù hợp
                    </h2>
                    <p
                      className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {hasActiveFilters
                        ? "Không có sinh vật nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn. Hãy thử xóa bộ lọc để xem toàn bộ danh mục."
                        : "Cơ sở dữ liệu sinh vật hiện đang trống hoặc chưa có bản ghi nào được tạo."}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                      {hasActiveFilters && onResetFilters && (
                        <button
                          onClick={onResetFilters}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all cursor-pointer active:scale-95"
                        >
                          <RotateCcw size={14} />
                          <span>Đặt lại bộ lọc</span>
                        </button>
                      )}

                      {onOpenAddModal && (
                        <button
                          onClick={onOpenAddModal}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm border border-sky-400/20 transition-all cursor-pointer active:scale-95"
                        >
                          <Plus size={14} />
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
                          ? "bg-white/10 border-l-4 border-sky-400 font-semibold"
                          : "bg-sky-50/80 border-l-4 border-sky-600 font-semibold text-slate-900"
                        : isDark
                          ? "hover:bg-white/5"
                          : "hover:bg-slate-50"
                    }`}
                  >
                    <td
                      className="px-2 py-3.5 text-center"
                      onClick={(e) => handleToggleCheckRow(item.id, e)}
                    >
                      {isChecked ? (
                        <CheckSquare size={14} className="text-sky-400" />
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
                      className={`px-2.5 py-3.5 font-mono text-xs font-semibold truncate ${
                        isDark ? "text-slate-200" : "text-slate-800"
                      }`}
                    >
                      {item.code}
                    </td>
                    <td
                      className={`px-2.5 py-3.5 font-bold truncate ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {item.name || item.scientificName || "Sinh vật biển"}
                    </td>
                    <td
                      className={`px-2.5 py-3.5 font-mono text-xs truncate ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {item.gbifId}
                    </td>
                    <td className="px-2.5 py-3.5 font-medium truncate">
                      {item.source}
                    </td>
                    <td className="px-2.5 py-3.5 truncate">{item.location}</td>
                    <td className="px-2.5 py-3.5 truncate">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          item.conservationCode === "CR" || item.conservationCode === "EX" || item.conservationCode === "EW"
                            ? isDark
                              ? "bg-rose-950/50 text-rose-300 border border-rose-800/60"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                            : item.conservationCode === "EN"
                              ? isDark
                                ? "bg-orange-950/50 text-orange-300 border border-orange-800/60"
                                : "bg-orange-50 text-orange-700 border border-orange-200"
                              : item.conservationCode === "VU"
                                ? isDark
                                  ? "bg-amber-950/50 text-amber-300 border border-amber-800/60"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                                : item.conservationCode === "NT"
                                  ? isDark
                                    ? "bg-teal-950/50 text-teal-300 border border-teal-800/60"
                                    : "bg-teal-50 text-teal-700 border border-teal-200"
                                  : item.conservationCode === "LC"
                                    ? isDark
                                      ? "bg-emerald-950/50 text-emerald-300 border border-emerald-800/60"
                                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : isDark
                                      ? "bg-slate-800/60 text-slate-300 border border-slate-700/60"
                                      : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {item.conservation}
                      </span>
                    </td>
                    <td
                      className={`px-2 py-3.5 text-center font-mono text-xs truncate ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {(item.views || 0).toLocaleString()}
                    </td>
                    <td className="px-2.5 py-3.5 text-center truncate">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.is_visible
                            ? isDark
                              ? "bg-emerald-950/50 text-emerald-300 border border-emerald-800/50"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isDark
                              ? "bg-slate-800/60 text-slate-400 border border-slate-700/50"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.is_visible ? "bg-emerald-400" : "bg-slate-400"
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-2 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedRowId(isExpanded ? null : item.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isExpanded
                              ? isDark ? "bg-white/15 text-white" : "bg-slate-200 text-slate-900"
                              : isDark
                              ? "text-slate-400 hover:text-white hover:bg-white/10"
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                          title={isExpanded ? "Thu gọn chi tiết" : "Xem chi tiết sinh vật"}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={(e) => handleOpenEditModal(item, e)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isDark
                              ? "text-slate-400 hover:text-amber-300 hover:bg-amber-950/30"
                              : "text-slate-500 hover:text-amber-700 hover:bg-amber-50"
                          }`}
                          title="Chỉnh sửa thông tin"
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
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
