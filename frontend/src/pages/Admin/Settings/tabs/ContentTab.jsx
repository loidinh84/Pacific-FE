import { Link } from "react-router-dom";
import {
  MessageCircle,
  ExternalLink,
  Bot,
  ShieldAlert,
  Filter,
  Plus,
  X,
  Flag,
  ShieldCheck,
  Clock,
} from "lucide-react";
import CustomSelect from "../../Dashboard/components/CustomSelect";
import {
  AI_SENSITIVITY_OPTIONS,
  PROFANITY_ACTION_OPTIONS,
  MAX_REPORTS_OPTIONS,
  COOLDOWN_OPTIONS,
} from "../settingsConstants";

export default function ContentTab({
  formData,
  updateSection,
  isDark,
  bannedWordInput,
  setBannedWordInput,
  handleAddBannedWord,
  handleRemoveBannedWord,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Tab 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
            <span>Nội dung & Bình luận</span>
          </h2>
          <p
            className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Thiết lập quy tắc kiểm duyệt AI, bộ lọc từ khóa nhạy cảm, chống spam
            và cơ chế xử lý báo cáo vi phạm
          </p>
        </div>

        <Link
          to="/admin/comments"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
            isDark
              ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
              : "bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200"
          }`}
        >
          <MessageCircle size={14} />
          <span>Trang quản lý bình luận</span>
          <ExternalLink size={12} />
        </Link>
      </div>

      {/* 3.1 Khối Kiểm duyệt AI */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Bot size={15} />
            <span>Kiểm duyệt thông minh bằng AI</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Tự động phân tích ngữ nghĩa bình luận, nhận diện phát ngôn thù địch,
            xúc phạm danh dự hoặc spam
          </p>
        </div>

        <div className="space-y-4 divide-y divide-white/10 pt-1">
          {/* Toggle 1: Kích hoạt kiểm duyệt AI */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Bot size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold">
                    Kích hoạt kiểm duyệt tự động bằng AI
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                    Khuyên dùng
                  </span>
                </div>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Mô hình NLP sẽ quét các bình luận ngay khi người dùng gửi và
                  tự động gắn cờ nếu phát hiện nội dung độc hại.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.content.autoModeration}
              onClick={() =>
                updateSection(
                  "content",
                  "autoModeration",
                  !formData.content.autoModeration,
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.content.autoModeration
                  ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                  : isDark
                    ? "bg-white/15"
                    : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  formData.content.autoModeration
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Các tùy chọn con phụ thuộc vào Kiểm duyệt tự động */}
          {formData.content.autoModeration && (
            <>
              {/* Độ nhạy AI */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold">
                    Mức độ nhạy kiểm duyệt của AI
                  </h4>
                  <p
                    className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Xác định ngưỡng phân loại để mô hình quyết định gắn cờ cảnh
                    báo
                  </p>
                </div>
                <CustomSelect
                  options={AI_SENSITIVITY_OPTIONS}
                  value={formData.content.aiSensitivity || "medium"}
                  onChange={(val) =>
                    updateSection("content", "aiSensitivity", val)
                  }
                  isDark={isDark}
                  size="sm"
                  className="w-full sm:w-72 shrink-0"
                />
              </div>

              {/* Toggle Thông báo quản trị viên */}
              <div className="pt-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">
                      Cảnh báo tức thì đến quản trị viên
                    </h4>
                    <p
                      className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Hiển thị chấm đỏ thông báo trên thanh điều hướng Admin khi
                      có bình luận mới bị AI gắn cờ vi phạm.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.content.notifyAdminOnFlag !== false}
                  onClick={() =>
                    updateSection(
                      "content",
                      "notifyAdminOnFlag",
                      formData.content.notifyAdminOnFlag === false,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    formData.content.notifyAdminOnFlag !== false
                      ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                      : isDark
                        ? "bg-white/15"
                        : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      formData.content.notifyAdminOnFlag !== false
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3.2 Khối Bộ lọc từ ngữ */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Filter size={15} />
            <span>Bộ lọc từ ngữ nhạy cảm & Từ khóa cấm</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Kiểm soát các từ ngữ thô tục, xúc phạm hoặc lừa đảo tài chính trong
            các cuộc thảo luận
          </p>
        </div>

        <div className="space-y-4 divide-y divide-white/10 pt-1">
          {/* Toggle 1: Kích hoạt bộ lọc */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                <Filter size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold">
                    Kích hoạt bộ lọc từ ngữ nhạy cảm
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/30">
                    Bảo vệ cộng đồng
                  </span>
                </div>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Tự động nhận diện danh sách từ cấm và áp dụng hành vi xử lý khi
                  người dùng bình luận.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.content.filterProfanity}
              onClick={() =>
                updateSection(
                  "content",
                  "filterProfanity",
                  !formData.content.filterProfanity,
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.content.filterProfanity
                  ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                  : isDark
                    ? "bg-white/15"
                    : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  formData.content.filterProfanity
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {formData.content.filterProfanity && (
            <>
              {/* Hành vi khi phát hiện từ cấm */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold">
                    Hành vi khi phát hiện từ cấm
                  </h4>
                  <p
                    className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Cách hệ thống phản hồi khi người dùng nhập từ trong danh sách
                    cấm
                  </p>
                </div>
                <CustomSelect
                  options={PROFANITY_ACTION_OPTIONS}
                  value={formData.content.profanityAction || "mask"}
                  onChange={(val) =>
                    updateSection("content", "profanityAction", val)
                  }
                  isDark={isDark}
                  size="sm"
                  className="w-full sm:w-80 shrink-0"
                />
              </div>

              {/* Quản lý danh sách từ khóa cấm */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">
                      Danh sách từ khóa cấm tùy chỉnh
                    </h4>
                    <p
                      className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Đã thiết lập{" "}
                      {formData.content.customBannedWords?.length || 0} từ khóa
                      cấm
                    </p>
                  </div>
                </div>

                {/* Input thêm từ cấm */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bannedWordInput}
                    onChange={(e) => setBannedWordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddBannedWord();
                      }
                    }}
                    placeholder="Nhập từ hoặc cụm từ cần cấm rồi nhấn Enter..."
                    className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none font-medium transition-colors ${
                      isDark
                        ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                        : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddBannedWord}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                    <span>Thêm từ</span>
                  </button>
                </div>

                {/* Danh sách badge từ cấm */}
                <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto">
                  {(formData.content.customBannedWords || []).map(
                    (word, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isDark
                            ? "bg-red-500/10 border-red-500/25 text-red-300 hover:border-red-500/40"
                            : "bg-red-50 border-red-200 text-red-700 hover:border-red-300"
                        }`}
                      >
                        <span>{word}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBannedWord(word)}
                          className="hover:opacity-60 cursor-pointer ml-1 p-0.5 text-red-400"
                          title={`Xóa "${word}"`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ),
                  )}
                  {(!formData.content.customBannedWords ||
                    formData.content.customBannedWords.length === 0) && (
                    <div
                      className={`text-xs italic py-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                    >
                      Chưa có từ khóa cấm nào. Hãy nhập từ khóa ở ô trên để thêm
                      vào danh sách.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3.3 Khối Báo cáo vi phạm */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Flag size={15} />
            <span>Xử lý báo cáo vi phạm từ cộng đồng</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Quy định ngưỡng cảnh báo tự động khi thành viên trong portal gửi báo
            cáo về một bình luận
          </p>
        </div>

        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                <Flag size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold">
                    Ngưỡng báo cáo tự động tạm ẩn bình luận
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 font-semibold border border-rose-500/30">
                    Tự động ẩn
                  </span>
                </div>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Khi số lượt người dùng báo cáo một bình luận đạt ngưỡng này, hệ
                  thống sẽ tự động chuyển trạng thái bình luận sang "Tạm ẩn" để
                  chờ quản trị viên duyệt.
                </p>
              </div>
            </div>

            <CustomSelect
              options={MAX_REPORTS_OPTIONS}
              value={formData.content.maxReportsToHide || 3}
              onChange={(val) =>
                updateSection("content", "maxReportsToHide", Number(val))
              }
              isDark={isDark}
              size="sm"
              className="w-full sm:w-64 shrink-0"
            />
          </div>
        </div>
      </div>

      {/* 3.4 Khối Chính sách thảo luận */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Clock size={15} />
            <span>Chính sách thảo luận & Tần suất đăng</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Chống spam bot, kiểm soát chất lượng nội dung trước khi xuất bản công
            khai
          </p>
        </div>

        <div className="space-y-4 divide-y divide-white/10 pt-1">
          {/* Toggle Duyệt thủ công trước khi xuất bản */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Kiểm duyệt thủ công trước khi hiển thị
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Mọi bình luận mới sẽ ở trạng thái chờ duyệt và chỉ xuất hiện
                  khi quản trị viên phê duyệt.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.content.requireApprovalFirst}
              onClick={() =>
                updateSection(
                  "content",
                  "requireApprovalFirst",
                  !formData.content.requireApprovalFirst,
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.content.requireApprovalFirst
                  ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                  : isDark
                    ? "bg-white/15"
                    : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  formData.content.requireApprovalFirst
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Cooldown chống spam */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <Clock size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Khoảng thời gian chờ giữa 2 bình luận
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Ngăn chặn người dùng gửi liên tiếp quá nhanh hoặc bot spam bình
                  luận hàng loạt.
                </p>
              </div>
            </div>

            <CustomSelect
              options={COOLDOWN_OPTIONS}
              value={formData.content.commentCooldownSeconds ?? 15}
              onChange={(val) =>
                updateSection(
                  "content",
                  "commentCooldownSeconds",
                  Number(val),
                )
              }
              isDark={isDark}
              size="sm"
              className="w-full sm:w-72 shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
