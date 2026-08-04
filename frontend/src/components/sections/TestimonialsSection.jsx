const REVIEWS = [
  {
    id: 1,
    name: "Nguyễn Minh Tú",
    role: "Học sinh lớp 10",
    avatar: "N",
    avatarBg: "from-pacific-blue-bright to-pacific-teal",
    stars: 5,
    quote:
      "Trang web rất thú vị! Tôi học được rất nhiều điều về các sinh vật biển mà trước giờ chưa biết. Giao diện đẹp và dễ sử dụng.",
    delay: "100",
  },
  {
    id: 2,
    name: "Trần Thị Lan Anh",
    role: "Sinh viên Đại học",
    avatar: "T",
    avatarBg: "from-indigo-500 to-pacific-cyan",
    stars: 5,
    quote:
      "Nội dung về Thái Bình Dương rất chi tiết và đầy đủ. Phần trắc nghiệm vui cũng rất sáng tạo! Chắc chắn sẽ giới thiệu cho bạn bè.",
    delay: "200",
  },
  {
    id: 3,
    name: "Lê Hoàng Nam",
    role: "Giáo viên THPT",
    avatar: "L",
    avatarBg: "from-amber-500 to-rose-500",
    stars: 4,
    quote:
      "Nguồn tài liệu rất hữu ích cho việc giảng dạy về đại dương. Tôi sẽ dùng trang này để bổ sung kiến thức cho học sinh của mình.",
    delay: "300",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-pacific-figma-dark py-15 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-pacific-teal/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-black text-white font-heading">
            Họ nói gì về Pacific?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div
              key={r.id}
              className="bg-pacific-figma-card rounded-2xl p-7 shadow-lg flex flex-col justify-between hover:border hover:border-pacific-blue-bright hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={r.delay}
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="text-amber-500 text-lg leading-none"
                      style={{ opacity: i < r.stars ? 1 : 0.25 }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/85 italic text-sm md:text-base leading-relaxed mb-6">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-base bg-gradient-to-br ${r.avatarBg}`}
                >
                  {r.avatar}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white leading-tight">
                    {r.name}
                  </p>
                  <p className="text-xs text-white/50 font-medium">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
