import { Plus, RefreshCw } from "lucide-react";

export default function SpeciesManagement() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading">
            Quản lý sinh vật
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Tra cứu, cập nhật thông tin và đồng bộ hóa danh mục sinh vật biển Thái Bình Dương
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-md">
            <RefreshCw size={15} />
            <span>Đồng bộ API</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-md">
            <Plus size={16} />
            <span>+ Thêm sinh vật mới</span>
          </button>
        </div>
      </div>

      {/* Content Placeholder for next step */}
      <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
        <p className="text-slate-400 text-sm">
          [ Giao diện bộ lọc & Bảng dữ liệu quản lý sinh vật ]
        </p>
      </div>
    </div>
  );
}
