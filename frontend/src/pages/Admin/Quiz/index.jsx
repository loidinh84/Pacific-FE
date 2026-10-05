/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Check,
  TrendingUp,
  Award,
  BookOpen,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import {
  fetchAdminQuizList,
  createAdminQuizQuestion,
  updateAdminQuizQuestion,
  deleteAdminQuizQuestion,
  toggleAdminQuizQuestion,
} from "../../../services/adminQuizApi";

export default function QuizManagement() {
  const { isDark } = useTheme();
  const { toasts, showToast, removeToast } = useToast();

  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    activeCount: 0,
    inactiveCount: 0,
    totalAnswers: 0,
    correctRate: 0,
    categories: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    question: "",
    category: "Sinh vật biển",
    difficulty: "easy",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
    explanation: "",
    isActive: true,
  });

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    questionId: null,
    questionText: "",
    isDeleting: false,
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load questions from API
  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetchAdminQuizList({
        search: debouncedSearch,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        status: selectedStatus,
        page,
        limit: 8,
      });

      if (res?.success) {
        setQuestions(res.data || []);
        if (res.pagination) {
          setTotalCount(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        }
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      showToast("Không thể tải danh sách câu hỏi trắc nghiệm", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, selectedCategory, selectedDifficulty, selectedStatus]);

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setFormData({
      question: "",
      category: "Sinh vật biển",
      difficulty: "easy",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
      explanation: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setFormData({
      question: q.question,
      category: q.category || "Sinh vật biển",
      difficulty: q.difficulty || "medium",
      options: Array.isArray(q.options) && q.options.length >= 2 ? [...q.options] : ["", "", "", ""],
      correctAnswerIndex: q.correctAnswerIndex ?? 0,
      explanation: q.explanation || "",
      isActive: q.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!formData.question.trim()) {
      showToast("Vui lòng nhập nội dung câu hỏi", "error");
      return;
    }
    if (formData.options.some((opt) => !opt.trim())) {
      showToast("Vui lòng điền đầy đủ cả 4 phương án trả lời", "error");
      return;
    }

    try {
      setIsSaving(true);
      if (editingQuestion) {
        const res = await updateAdminQuizQuestion(editingQuestion.id, formData);
        if (res?.success) {
          showToast("Cập nhật câu hỏi thành công!", "success");
          setIsModalOpen(false);
          loadData();
        }
      } else {
        const res = await createAdminQuizQuestion(formData);
        if (res?.success) {
          showToast("Thêm câu hỏi mới thành công!", "success");
          setIsModalOpen(false);
          loadData();
        }
      }
    } catch (err) {
      showToast(err?.response?.data?.error || err.message || "Lỗi khi lưu câu hỏi", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle active status
  const handleToggle = async (id) => {
    try {
      const res = await toggleAdminQuizQuestion(id);
      if (res?.success) {
        showToast(res.message, "success");
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, isActive: !q.isActive } : q))
        );
        setStats((prev) => ({
          ...prev,
          activeCount: prev.activeCount + (res.data.isActive ? 1 : -1),
        }));
      }
    } catch (err) {
      showToast("Không thể thay đổi trạng thái câu hỏi", "error");
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteConfirm.questionId) return;
    try {
      setDeleteConfirm((prev) => ({ ...prev, isDeleting: true }));
      const res = await deleteAdminQuizQuestion(deleteConfirm.questionId);
      if (res?.success) {
        showToast("Đã xóa câu hỏi thành công", "success");
        setDeleteConfirm({ isOpen: false, questionId: null, questionText: "", isDeleting: false });
        loadData();
      }
    } catch (err) {
      showToast("Lỗi khi xóa câu hỏi", "error");
      setDeleteConfirm((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Difficulty badge styling
  const renderDifficultyBadge = (diff) => {
    const map = {
      easy: { label: "Dễ", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
      medium: { label: "Trung bình", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
      hard: { label: "Khó", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
    };
    const s = map[diff] || map.medium;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.color}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto py-2 space-y-6">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading">
            Ngân hàng câu hỏi trắc nghiệm
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Quản trị các câu hỏi đố vui kiến thức đại dương, sinh vật học và bảo tồn môi trường biển
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm transition-all cursor-pointer shadow-lg shadow-blue-600/25 active:scale-95 shrink-0"
        >
          <Plus size={16} />
          <span>Thêm câu hỏi mới</span>
        </button>
      </div>

      {/* ── METRIC STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border transition-colors ${
            isDark ? "bg-[#142144] border-white/10" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Tổng câu hỏi</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
              <HelpCircle size={18} />
            </div>
          </div>
          <p className="text-2xl font-black">{stats.total.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Trong ngân hàng dữ liệu</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-colors ${
            isDark ? "bg-[#142144] border-white/10" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Đang kích hoạt</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400">{stats.activeCount.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Sẵn sàng xuất hiện trong quiz</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-colors ${
            isDark ? "bg-[#142144] border-white/10" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Tỉ lệ trả lời đúng</span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-cyan-400">{stats.correctRate}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Độ chính xác trung bình của người chơi</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-colors ${
            isDark ? "bg-[#142144] border-white/10" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Lượt tương tác trả lời</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Award size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400">{stats.totalAnswers.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Tổng số lần trả lời câu hỏi</span>
        </div>
      </div>

      {/* ── FILTER TOOLBAR ── */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-3 items-center justify-between transition-colors ${
          isDark ? "bg-[#142144] border-white/10" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo nội dung câu hỏi hoặc chủ đề..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border outline-none transition-colors ${
              isDark
                ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs border outline-none cursor-pointer ${
              isDark ? "bg-[#0b1329] border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <option value="all">Tất cả chủ đề</option>
            <option value="Sinh vật biển">Sinh vật biển</option>
            <option value="Vùng đại dương">Vùng đại dương</option>
            <option value="Độ sâu & Áp suất">Độ sâu & Áp suất</option>
            <option value="Rạn san hô">Rạn san hô</option>
            <option value="Bảo tồn & Sinh thái">Bảo tồn & Sinh thái</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs border outline-none cursor-pointer ${
              isDark ? "bg-[#0b1329] border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <option value="all">Tất cả độ khó</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs border outline-none cursor-pointer ${
              isDark ? "bg-[#0b1329] border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang kích hoạt</option>
            <option value="inactive">Đang tắt</option>
          </select>

          <button
            onClick={loadData}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark ? "border-white/15 hover:bg-white/10 text-slate-400" : "border-slate-200 hover:bg-slate-100 text-slate-600"
            }`}
            title="Tải lại danh sách"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── QUESTIONS LIST ── */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <RefreshCw size={28} className="animate-spin text-cyan-400" />
        </div>
      )}

      {!isLoading && questions.length === 0 && (
        <div
          className={`p-12 text-center rounded-3xl border ${
            isDark ? "bg-[#142144] border-white/10" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-cyan-500/15 text-cyan-400 mb-3">
            <HelpCircle size={32} />
          </div>
          <h3 className="text-base font-bold">Không tìm thấy câu hỏi nào</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Không có câu hỏi nào phù hợp với bộ lọc hiện tại. Hãy thử xóa bộ lọc hoặc thêm câu hỏi mới vào ngân hàng dữ liệu.
          </p>
        </div>
      )}

      {!isLoading && questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDark ? "bg-[#142144] border-white/10 hover:border-white/20" : "bg-white border-slate-200 shadow-xs hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                      #{(page - 1) * 8 + index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                      {q.category}
                    </span>
                    {renderDifficultyBadge(q.difficulty)}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        q.isActive
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                      }`}
                    >
                      {q.isActive ? "Đang bật" : "Tạm ẩn"}
                    </span>
                  </div>

                  {/* Question Content */}
                  <h3 className="text-base font-bold leading-snug">
                    {q.question}
                  </h3>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options?.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctAnswerIndex;
                      const letters = ["A", "B", "C", "D"];
                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                            isCorrect
                              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold"
                              : isDark
                              ? "bg-[#0b1329]/60 border-white/10 text-slate-300"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isCorrect
                                ? "bg-emerald-500 text-slate-950"
                                : isDark
                                ? "bg-white/10 text-slate-400"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {letters[optIdx]}
                          </span>
                          <span className="truncate flex-1">{opt}</span>
                          {isCorrect && <Check size={14} className="text-emerald-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation if present */}
                  {q.explanation && (
                    <div
                      className={`p-3 rounded-xl text-xs leading-relaxed mt-2 border ${
                        isDark ? "bg-[#0b1329]/40 border-white/5 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-600"
                      }`}
                    >
                      <strong className="text-cyan-400 font-semibold">Giải thích: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>

                {/* Right Actions */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-1">
                  <button
                    onClick={() => handleToggle(q.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      q.isActive
                        ? isDark
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : isDark
                        ? "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {q.isActive ? "Tạm tắt" : "Kích hoạt"}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isDark ? "hover:bg-white/10 text-amber-400" : "hover:bg-amber-50 text-amber-600"
                      }`}
                      title="Chỉnh sửa câu hỏi"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          questionId: q.id,
                          questionText: q.question,
                          isDeleting: false,
                        })
                      }
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isDark ? "hover:bg-white/10 text-rose-400" : "hover:bg-rose-50 text-rose-600"
                      }`}
                      title="Xóa câu hỏi"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* ── PAGINATION ── */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-slate-400">
              Hiển thị {questions.length} / {totalCount} câu hỏi (Trang {page} / {totalPages})
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={`p-2 rounded-xl border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold px-2">{page}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={`p-2 rounded-xl border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
              isDark ? "bg-[#121c38] border-white/15 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
                isDark ? "border-white/10 bg-[#162345]" : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                  <Sparkles size={18} />
                </div>
                <h2 className="text-base font-bold">
                  {editingQuestion ? "Chỉnh sửa câu hỏi trắc nghiệm" : "Thêm câu hỏi mới"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveQuestion} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {/* Question Content */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Nội dung câu hỏi <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Nhập nội dung câu đố sinh học biển..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none resize-none transition-colors ${
                    isDark
                      ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500"
                  }`}
                  required
                />
              </div>

              {/* Category & Difficulty Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Chủ đề câu hỏi</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                      isDark ? "bg-[#0b1329] border-white/15 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="Sinh vật biển">Sinh vật biển</option>
                    <option value="Vùng đại dương">Vùng đại dương</option>
                    <option value="Độ sâu & Áp suất">Độ sâu & Áp suất</option>
                    <option value="Rạn san hô">Rạn san hô</option>
                    <option value="Bảo tồn & Sinh thái">Bảo tồn & Sinh thái</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Mức độ khó</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                      isDark ? "bg-[#0b1329] border-white/15 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="easy">Dễ</option>
                    <option value="medium">Trung bình</option>
                    <option value="hard">Khó</option>
                  </select>
                </div>
              </div>

              {/* 4 Options with Correct Answer Selector */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-400 block">
                  4 Phương án trả lời (chọn nút tròn bên trái để đánh dấu đáp án đúng)
                </label>
                {formData.options.map((opt, idx) => {
                  const letters = ["A", "B", "C", "D"];
                  const isCorrect = formData.correctAnswerIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${
                        isCorrect
                          ? "bg-emerald-500/10 border-emerald-500/40"
                          : isDark
                          ? "bg-[#0b1329] border-white/15"
                          : "bg-slate-50 border-slate-300"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, correctAnswerIndex: idx })}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          isCorrect
                            ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                            : isDark
                            ? "bg-white/10 text-slate-400 hover:text-white"
                            : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                        }`}
                        title="Đánh dấu đây là đáp án đúng"
                      >
                        {isCorrect ? <Check size={14} /> : letters[idx]}
                      </button>

                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...formData.options];
                          newOpts[idx] = e.target.value;
                          setFormData({ ...formData, options: newOpts });
                        }}
                        placeholder={`Nội dung phương án ${letters[idx]}...`}
                        className={`flex-1 bg-transparent text-xs outline-none px-2 ${
                          isCorrect ? "font-bold text-emerald-300" : ""
                        }`}
                        required
                      />

                      {isCorrect && (
                        <span className="text-[11px] font-semibold text-emerald-400 px-2 shrink-0">
                          Đáp án đúng
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Field */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Giải thích chi tiết (hiển thị sau khi người chơi trả lời)
                </label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Kiến thức khoa học giải thích cho câu hỏi này..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none resize-none transition-colors ${
                    isDark
                      ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <h4 className="text-xs font-bold">Kích hoạt câu hỏi ngay</h4>
                  <p className="text-[11px] text-slate-400">Cho phép câu hỏi xuất hiện trong các bài trắc nghiệm</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>{editingQuestion ? "Cập nhật câu hỏi" : "Tạo câu hỏi"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 ${
              isDark ? "bg-[#142144] border-white/15 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <h3 className="text-base font-bold">Xác nhận xóa câu hỏi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng câu hỏi đại dương không?
            </p>
            <div
              className={`p-3 rounded-xl text-xs italic border ${
                isDark ? "bg-[#0b1329] border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              "{deleteConfirm.questionText}"
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() =>
                  setDeleteConfirm({ isOpen: false, questionId: null, questionText: "", isDeleting: false })
                }
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteConfirm.isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {deleteConfirm.isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
