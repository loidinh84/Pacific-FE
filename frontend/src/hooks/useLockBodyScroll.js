import { useEffect } from "react";

/**
 * useLockBodyScroll - Hook tự động khóa cuộn trang (body scroll) khi Modal mở
 * Hỗ trợ tự động hoàn tác (restore) trạng thái overflow ban đầu khi Modal đóng hoặc unmount
 * @param {boolean} [isLocked=true] - Trạng thái khóa cuộn (thường truyền isOpen của Modal)
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
