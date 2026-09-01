import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Layers,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import SpeciesGroupCard from "./SpeciesGroupCard";
import AddEditGroupModal from "./AddEditGroupModal";
import AssignSpeciesModal from "./AssignSpeciesModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  fetchAdminSpeciesGroups,
  createAdminSpeciesGroup,
  updateAdminSpeciesGroup,
  deleteAdminSpeciesGroup,
} from "../../../services/speciesGroupApi";

export default function SpeciesGroupsManagement() {
  const { isDark } = useTheme();

  // Data states
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state (Client-side / Server-side)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // Load groups from API
  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminSpeciesGroups();
      if (res.success && Array.isArray(res.groups)) {
        setGroups(res.groups);
      }
    } catch (err) {
      console.error("Lỗi khi tải nhóm sinh vật:", err);
      showToast("Không thể tải danh sách nhóm sinh vật.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // Filter groups based on search query
  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        (g.description && g.description.toLowerCase().includes(q))
    );
  }, [searchQuery, groups]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / itemsPerPage));
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGroups.slice(start, start + itemsPerPage);
  }, [currentPage, filteredGroups, itemsPerPage]);

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handlers for Add/Edit
  const handleOpenCreate = () => {
    setEditingGroup(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (group) => {
    setEditingGroup(group);
    setIsAddEditOpen(true);
  };

  const handleSaveGroup = async (formData) => {
    setIsModalLoading(true);
    try {
      if (editingGroup) {
        // Update
        const res = await updateAdminSpeciesGroup(editingGroup.id, formData);
        if (res.success) {
          showToast(res.message || "Cập nhật nhóm sinh vật thành công!");
          setIsAddEditOpen(false);
          await loadGroups();
        }
      } else {
        // Create
        const res = await createAdminSpeciesGroup(formData);
        if (res.success) {
          showToast(res.message || "Tạo nhóm sinh vật mới thành công!");
          setIsAddEditOpen(false);
          await loadGroups();
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Có lỗi xảy ra khi lưu nhóm sinh vật.";
      showToast(msg, "error");
    } finally {
      setIsModalLoading(false);
    }
  };

  // Handlers for Delete
  const handleOpenDelete = (group) => {
    setDeletingGroup(group);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingGroup) return;
    setIsDeleteLoading(true);
    try {
      const res = await deleteAdminSpeciesGroup(deletingGroup.id);
      if (res.success) {
        showToast(res.message || "Đã xóa nhóm sinh vật thành công!");
        setIsDeleteOpen(false);
        await loadGroups();
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Có lỗi xảy ra khi xóa nhóm.";
      showToast(msg, "error");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 ${
            toast.type === "error"
              ? "bg-rose-900/90 text-rose-100 border-rose-500/30"
              : "bg-emerald-900/90 text-emerald-100 border-emerald-500/30"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={18} className="text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* ── 1. HEADER SECTION (TITLE + SEARCH + BUTTONS) ── */}
      <div className="space-y-4">
        {/* Title & Top Right Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1
            className={`text-2xl sm:text-3xl font-black font-heading tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Nhóm sinh vật
          </h1>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Tạo nhóm mới</span>
          </button>
        </div>

        {/* Search bar & Assign button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm tên nhóm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                isDark
                  ? "bg-[#182649] border border-white/15 text-white placeholder:text-slate-400 focus:border-cyan-400"
                  : "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 shadow-sm"
              }`}
            />
          </div>

          {/* Gán sinh vật vào nhóm button */}
          <button
            type="button"
            onClick={() => setIsAssignOpen(true)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
              isDark
                ? "bg-[#2b3c6b] hover:bg-[#344882] text-white border border-white/10"
                : "bg-slate-200 hover:bg-slate-300 text-slate-800"
            }`}
          >
            <Layers size={15} className="text-cyan-400" />
            <span>Gán sinh vật vào nhóm</span>
          </button>
        </div>
      </div>

      {/* ── 2. MAIN CONTAINER (2-COLUMN GRID) ── */}
      <div
        className={`rounded-2xl border p-5 sm:p-7 shadow-xl space-y-6 transition-all ${
          isDark
            ? "bg-[#101b38]/90 border-white/10 backdrop-blur-md"
            : "bg-white border-slate-200"
        }`}
      >
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 size={36} className="animate-spin text-cyan-400 mb-3" />
            <p className="text-xs sm:text-sm font-semibold text-slate-400">
              Đang tải danh sách nhóm sinh vật...
            </p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center text-cyan-400">
              <Layers size={26} />
            </div>
            <h3 className="text-base font-bold">
              {searchQuery ? "Không tìm thấy nhóm phù hợp" : "Chưa có nhóm nào"}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `Không có kết quả nào khớp với "${searchQuery}". Hãy thử từ khóa khác.`
                : "Hãy tạo nhóm sinh vật đầu tiên để bắt đầu phân loại thế giới đại dương."}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={handleOpenCreate}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
              >
                <Plus size={14} />
                <span>Tạo nhóm ngay</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {paginatedGroups.map((group) => (
              <SpeciesGroupCard
                key={group.id}
                group={group}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        )}

        {/* ── 3. BOTTOM PAGINATION & COUNTER ── */}
        {!isLoading && filteredGroups.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            {/* Left: Pagination Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Trang đầu"
              >
                <ChevronsLeft size={14} />
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft size={14} />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[28px] h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-sm font-black"
                      : "hover:bg-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Trang sau"
              >
                <ChevronRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Trang cuối"
              >
                <ChevronsRight size={14} />
              </button>
            </div>

            {/* Right: Counter */}
            <div className="text-xs font-semibold text-slate-400">
              {filteredGroups.length}/{groups.length} nhóm sinh vật
            </div>
          </div>
        )}
      </div>

      {/* ── 4. MODALS ── */}
      {/* Add / Edit Group Modal */}
      <AddEditGroupModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveGroup}
        editingGroup={editingGroup}
        isLoading={isModalLoading}
      />

      {/* Assign Species to Group Modal */}
      <AssignSpeciesModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        groups={groups}
        onSuccess={(msg) => {
          showToast(msg);
          loadGroups();
        }}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        group={deletingGroup}
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
