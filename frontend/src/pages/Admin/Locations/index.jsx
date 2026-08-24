import { Plus } from "lucide-react";

export default function LocationsManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading">
            Quản lý địa điểm nổi tiếng
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Quản lý các tọa độ, rạn san hô, rãnh đại dương và khu bảo tồn biển Thái Bình Dương
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-md">
          <Plus size={16} />
          <span>+ Thêm địa điểm mới</span>
        </button>
      </div>

      <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
        <p className="text-slate-400 text-sm">
          [ Khu vực: Danh sách các địa điểm nổi tiếng Thái Bình Dương ]
        </p>
      </div>
    </div>
  );
}
