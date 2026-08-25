import { useState } from "react";
import { Send } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export function SpeciesComments() {
  const { t } = useLanguage();
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList([
      ...commentsList,
      {
        id: Date.now(),
        text: commentText.trim(),
        user: t("speciesDetail.you"),
        time: t("speciesDetail.justNow"),
      },
    ]);
    setCommentText("");
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10 mb-12">
      <div className="bg-[#0e1f38] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-lg md:text-xl font-bold text-white font-heading">
          {t("speciesDetail.commentsTitle")}
        </h2>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t("speciesDetail.commentPlaceholder")}
            className="flex-1 bg-[#15294a] border border-white/15 text-white placeholder:text-white/40 text-xs md:text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-semibold transition-all cursor-pointer shrink-0"
          >
            <span>{t("speciesDetail.btnSendComment")}</span>
            <Send size={14} />
          </button>
        </form>

        {/* Comments Display Area */}
        <div className="pt-4 border-t border-white/10">
          {commentsList.length === 0 ? (
            <p className="text-center text-white/50 text-xs md:text-sm py-4 italic">
              {t("speciesDetail.noComments")}
            </p>
          ) : (
            <div className="space-y-3">
              {commentsList.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-cyan-300 font-semibold">
                    <span>{c.user}</span>
                    <span className="text-white/40">{c.time}</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-200">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
