import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export function SocialLoginButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-xs font-semibold transition-all cursor-pointer active:translate-y-0.5"
      >
        <FcGoogle size={16} />
        <span>Google</span>
      </button>
      <button
        type="button"
        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-xs font-semibold transition-all cursor-pointer active:translate-y-0.5"
      >
        <FaGithub size={16} />
        <span>GitHub</span>
      </button>
    </div>
  );
}
