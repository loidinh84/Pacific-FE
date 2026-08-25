import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export function SocialLoginButtons() {
  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const res = await axios.post("/api/auth/google", {
        accessToken: tokenResponse.access_token,
      });

      if (res.data?.token) {
        localStorage.setItem("pacific_token", res.data.token);
        localStorage.setItem("pacific_user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("pacific_auth_change"));
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert(err.response?.data?.message || "Đăng nhập bằng Google thất bại. Vui lòng thử lại!");
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (err) => console.error("Google Login Failed:", err),
  });

  const handleGithubLogin = () => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!githubClientId) {
      alert("Chưa cấu hình VITE_GITHUB_CLIENT_ID trong file .env!");
      return;
    }
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=user:email`;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => loginWithGoogle()}
        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-xs font-semibold transition-all cursor-pointer active:translate-y-0.5"
      >
        <FcGoogle size={16} />
        <span>Google</span>
      </button>
      <button
        type="button"
        onClick={handleGithubLogin}
        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-xs font-semibold transition-all cursor-pointer active:translate-y-0.5"
      >
        <FaGithub size={16} />
        <span>GitHub</span>
      </button>
    </div>
  );
}


