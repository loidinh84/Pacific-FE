import { AlertCircle, Send } from "lucide-react";
import { useState } from "react";

export default function FeedbackSection() {
  const [sent, setSent] = useState(false);
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setText("");
    }, 3000);
  };

  return (
    <section className="bg-gradient-to-r from-sky-100 to-sky-50 py-16 text-center">
      <div className="max-w-2xl mx-auto px-6">
        <div className="w-14 h-14 bg-gradient-to-r from-pacific-blue-bright to-pacific-teal rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-lg shadow-pacific-blue-bright/20">
          <AlertCircle size={26} />
        </div>

        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-3">
          Lưu ý từ đội ngũ Pacific
        </h2>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-8">
          Thông tin có thể xảy ra sai sót và trong giai đoạn phát triển. Nếu bạn
          nhận thấy điều gì chưa chính xác, hãy cho chúng tôi xin ý kiến của bạn
          nhé!
        </p>

        {!sent ? (
          <div className="flex gap-3 max-w-lg mx-auto">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập ý kiến của bạn..."
              className="flex-1 px-5 py-3 rounded-full border border-pacific-blue-bright/30 bg-white/95 text-sm text-slate-800 outline-none focus:border-pacific-blue-bright transition-all"
            />
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-pacific-blue-bright to-pacific-teal text-white shadow-md shadow-pacific-blue-bright/10 hover:shadow-lg hover:shadow-pacific-blue-bright/20 transition-all cursor-pointer"
              onClick={handleSend}
            >
              <Send size={14} />
              Gửi
            </button>
          </div>
        ) : (
          <div className="px-6 py-3 rounded-full bg-pacific-blue-bright/15 border border-pacific-blue-bright/35 text-pacific-navy font-semibold text-sm inline-block">
            ✅ Cảm ơn bạn đã gửi ý kiến!
          </div>
        )}
      </div>
    </section>
  );
}
