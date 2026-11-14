/**
 * Utility to localize backend error messages, success responses, and validation alerts.
 */

const KNOWN_MESSAGES = [
  // Auth & Login
  {
    pattern: /email hoặc mật khẩu không chính xác/i,
    en: "Invalid email/username or password!",
    vi: "Email hoặc mật khẩu không chính xác!",
  },
  {
    pattern: /vui lòng nhập email và mật khẩu/i,
    en: "Please enter your email and password!",
    vi: "Vui lòng nhập Email và Mật khẩu!",
  },
  {
    pattern: /vui lòng điền đầy đủ email và mật khẩu/i,
    en: "Please fill in all email and password fields!",
    vi: "Vui lòng điền đầy đủ Email và Mật khẩu!",
  },
  {
    pattern: /tài khoản của bạn đã bị khóa/i,
    en: "Your account has been locked! Please contact an administrator.",
    vi: "Tài khoản của bạn đã bị khóa! Vui lòng liên hệ quản trị viên.",
  },
  {
    pattern: /tài khoản này được đăng nhập bằng google/i,
    en: "This account was registered using Google / Social login.",
    vi: "Tài khoản này được đăng nhập bằng Google/Mạng xã hội.",
  },
  {
    pattern: /đăng nhập thành công/i,
    en: "Login successful!",
    vi: "Đăng nhập thành công!",
  },
  {
    pattern: /đang xác thực tài khoản github/i,
    en: "Authenticating GitHub account...",
    vi: "Đang xác thực tài khoản GitHub...",
  },
  {
    pattern: /đăng nhập github thành công/i,
    en: "GitHub login successful!",
    vi: "Đăng nhập GitHub thành công!",
  },
  {
    pattern: /đăng nhập bằng github thất bại/i,
    en: "GitHub login failed!",
    vi: "Đăng nhập bằng GitHub thất bại!",
  },
  {
    pattern: /đăng nhập bằng google thất bại/i,
    en: "Google login failed. Please try again!",
    vi: "Đăng nhập bằng Google thất bại. Vui lòng thử lại!",
  },
  {
    pattern: /đăng nhập thất bại/i,
    en: "Login failed. Please check your credentials!",
    vi: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!",
  },

  // Register & Account Creation
  {
    pattern: /email này đã được sử dụng|email đã tồn tại|email.*đã được đăng ký/i,
    en: "This email address is already registered!",
    vi: "Email này đã được sử dụng bởi một tài khoản khác!",
  },
  {
    pattern: /tên đăng nhập này đã được sử dụng|tên đăng nhập đã tồn tại/i,
    en: "This username is already taken!",
    vi: "Tên đăng nhập này đã được sử dụng!",
  },
  {
    pattern: /đăng ký tài khoản thành công/i,
    en: "Account registered successfully! Redirecting to login...",
    vi: "Đăng ký tài khoản thành công! Đang chuyển sang trang Đăng nhập...",
  },
  {
    pattern: /đăng ký thất bại/i,
    en: "Registration failed. Please check your information!",
    vi: "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!",
  },
  {
    pattern: /mật khẩu phải có ít nhất \d+ ký tự|mật khẩu phải có ít nhất 6 ký tự/i,
    en: "Password must be at least 6 characters long!",
    vi: "Mật khẩu phải có ít nhất 6 ký tự!",
  },
  {
    pattern: /mật khẩu.*tối thiểu 8 ký tự/i,
    en: "Password must be at least 8 characters with uppercase, lowercase and numbers!",
    vi: "Mật khẩu mới phải có tối thiểu 8 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số",
  },
  {
    pattern: /mật khẩu phải chứa ít nhất 1 chữ hoa hoặc ký tự đặc biệt/i,
    en: "Password must contain at least 1 uppercase letter or special character!",
    vi: "Mật khẩu phải chứa ít nhất 1 chữ hoa hoặc ký tự đặc biệt!",
  },
  {
    pattern: /xác nhận mật khẩu.*không khớp|mật khẩu xác nhận không trùng khớp/i,
    en: "Password confirmation does not match!",
    vi: "Mật khẩu xác nhận không trùng khớp!",
  },

  // Password Reset
  {
    pattern: /nếu email tồn tại trong hệ thống/i,
    en: "If the email exists in our system, reset instructions have been sent.",
    vi: "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.",
  },
  {
    pattern: /đã gửi hướng dẫn khôi phục/i,
    en: "Reset instructions have been sent to your email!",
    vi: "Đã gửi hướng dẫn khôi phục tới email của bạn!",
  },
  {
    pattern: /không thể gửi email khôi phục/i,
    en: "Unable to send reset email. Please try again later!",
    vi: "Không thể gửi email khôi phục. Vui lòng thử lại sau!",
  },
  {
    pattern: /mã khôi phục không hợp lệ|link đặt lại mật khẩu đã hết hạn|link đặt lại mật khẩu không hợp lệ/i,
    en: "Password reset link is invalid or has expired!",
    vi: "Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ!",
  },
  {
    pattern: /mã khôi phục này đã được sử dụng/i,
    en: "This reset link has already been used!",
    vi: "Mã khôi phục này đã được sử dụng trước đó!",
  },
  {
    pattern: /mã khôi phục đã hết hạn/i,
    en: "Password reset link has expired! Please request a new one.",
    vi: "Mã khôi phục đã hết hạn! Vui lòng gửi lại yêu cầu mới.",
  },
  {
    pattern: /đặt lại mật khẩu thành công/i,
    en: "Password reset successful! Please log in with your new password.",
    vi: "Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.",
  },
  {
    pattern: /đã có lỗi xảy ra khi đặt lại mật khẩu/i,
    en: "An error occurred while resetting password!",
    vi: "Đã có lỗi xảy ra khi đặt lại mật khẩu!",
  },

  // Change Password & Profile
  {
    pattern: /mật khẩu hiện tại không chính xác|mật khẩu cũ không chính xác/i,
    en: "Current password is incorrect!",
    vi: "Mật khẩu hiện tại không chính xác!",
  },
  {
    pattern: /tài khoản chưa thiết lập mật khẩu/i,
    en: "Account has not set up a password yet.",
    vi: "Tài khoản chưa thiết lập mật khẩu.",
  },
  {
    pattern: /vui lòng điền đầy đủ các trường mật khẩu|vui lòng nhập mật khẩu cũ và mật khẩu mới/i,
    en: "Please fill in all password fields.",
    vi: "Vui lòng điền đầy đủ các trường mật khẩu.",
  },
  {
    pattern: /vui lòng nhập mật khẩu hiện tại/i,
    en: "Please enter your current password to confirm.",
    vi: "Vui lòng nhập mật khẩu hiện tại để xác nhận.",
  },
  {
    pattern: /đổi mật khẩu thành công/i,
    en: "Password changed successfully!",
    vi: "Đổi mật khẩu thành công!",
  },
  {
    pattern: /đổi mật khẩu thất bại|không thể đổi mật khẩu/i,
    en: "Failed to change password. Please try again!",
    vi: "Đổi mật khẩu thất bại. Vui lòng thử lại!",
  },
  {
    pattern: /cập nhật thông tin thành công|cập nhật hồ sơ.*thành công/i,
    en: "Profile updated successfully!",
    vi: "Cập nhật thông tin thành công!",
  },
  {
    pattern: /không thể cập nhật hồ sơ/i,
    en: "Unable to update profile. Please try again!",
    vi: "Không thể cập nhật hồ sơ!",
  },
  {
    pattern: /đổi email thất bại/i,
    en: "Failed to change email address!",
    vi: "Đổi email thất bại!",
  },

  // Comments, Feedback, News, Species
  {
    pattern: /nội dung bình luận không được để trống/i,
    en: "Comment content cannot be empty!",
    vi: "Nội dung bình luận không được để trống!",
  },
  {
    pattern: /bình luận quá nhanh|gửi quá nhanh/i,
    en: "You are posting too quickly. Please wait a moment!",
    vi: "Bạn đang gửi quá nhanh. Vui lòng chờ trong giây lát!",
  },
  {
    pattern: /không tìm thấy bình luận/i,
    en: "Comment not found!",
    vi: "Không tìm thấy bình luận!",
  },
  {
    pattern: /bạn không có quyền/i,
    en: "You do not have permission to perform this action!",
    vi: "Bạn không có quyền thực hiện thao tác này!",
  },
  {
    pattern: /không tìm thấy loài sinh vật|không tìm thấy sinh vật/i,
    en: "Species not found!",
    vi: "Không tìm thấy loài sinh vật!",
  },
  {
    pattern: /không thể gửi ý kiến/i,
    en: "Could not send feedback, please try again.",
    vi: "Không thể gửi ý kiến, vui lòng thử lại sau.",
  },
  {
    pattern: /gửi ý kiến.*thành công|gửi đánh giá thành công/i,
    en: "Feedback submitted successfully!",
    vi: "Gửi ý kiến đóng góp thành công!",
  },
  {
    pattern: /không thể lưu bài viết/i,
    en: "Unable to save article.",
    vi: "Không thể lưu bài viết.",
  },
  {
    pattern: /lỗi kết nối máy chủ|network error/i,
    en: "Server connection error. Please check your network connection!",
    vi: "Lỗi kết nối máy chủ. Vui lòng kiểm tra lại mạng!",
  },
  {
    pattern: /thao tác thất bại/i,
    en: "Operation failed. Please try again!",
    vi: "Thao tác thất bại. Vui lòng thử lại!",
  },
  {
    pattern: /lỗi hệ thống|đã có lỗi xảy ra/i,
    en: "A system error occurred. Please try again later!",
    vi: "Lỗi hệ thống. Vui lòng thử lại sau!",
  },
];

/**
 * Trích xuất chuỗi thông báo từ Error object hoặc string
 */
export function extractRawMessage(errorOrMsg) {
  if (!errorOrMsg) return "";
  if (typeof errorOrMsg === "string") return errorOrMsg;
  if (errorOrMsg.response?.data?.message) return errorOrMsg.response.data.message;
  if (errorOrMsg.response?.data?.error) return errorOrMsg.response.data.error;
  if (errorOrMsg.response?.data?.msg) return errorOrMsg.response.data.msg;
  if (errorOrMsg.message) return errorOrMsg.message;
  return "";
}

/**
 * Chuyển đổi thông báo API / validation sang ngôn ngữ hiện tại
 * @param {any} errorOrMsg - Error object từ Axios hoặc chuỗi message
 * @param {string} language - "vi" hoặc "en"
 * @param {string} defaultFallback - Thông báo mặc định khi không tìm thấy
 */
export function localizeMessage(errorOrMsg, language = "vi", defaultFallback = "") {
  const raw = extractRawMessage(errorOrMsg);

  if (language === "vi") {
    return raw || defaultFallback || "Đã xảy ra lỗi. Vui lòng thử lại!";
  }

  // Nếu là ngôn ngữ tiếng Anh
  if (!raw) {
    return defaultFallback || "An error occurred. Please try again!";
  }

  // Tra cứu theo bảng quy tắc KNOWN_MESSAGES
  for (const item of KNOWN_MESSAGES) {
    if (item.pattern.test(raw)) {
      return item.en;
    }
  }

  // Kiểm tra nếu chuỗi không có dấu tiếng Việt (đã là tiếng Anh thuần)
  const hasVietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
    raw
  );
  if (!hasVietnameseChars) {
    return raw;
  }

  return defaultFallback || "An error occurred. Please try again!";
}

export const getLocalizedErrorMessage = localizeMessage;
export default localizeMessage;

