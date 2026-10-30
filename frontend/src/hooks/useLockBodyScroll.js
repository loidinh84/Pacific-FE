import { useEffect } from "react";

/**
 * Khóa cuộn trang khi mở modal
 * Khôi phục trạng thái cuộn ban đầu khi đóng modal
 * @param {boolean} [isLocked=true] - Trạng thái khóa cuộn
 */
export function useLockBodyScroll(isLocked = true) {
  useEffect(() => {
    if (!isLocked) return;

    // Lưu lại style overflow ban đầu của body
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle || "unset";
    };
  }, [isLocked]);
}

export default useLockBodyScroll;
