export default function UsersManagement() {
  return (
    <div className="space-y-6">
      {/* ── TOP HEADER ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-black font-heading tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          Quản lý người dùng
        </h1>
      </div>

      <div className="rounded-2xl border border-white/20 bg-[#0b1739]/85 backdrop-blur-md p-12 text-center shadow-sm">
        <p className="text-white text-sm font-semibold">
          [ Khu vực: Danh sách tài khoản người dùng & phân quyền ]
        </p>
      </div>
    </div>
  );
}
