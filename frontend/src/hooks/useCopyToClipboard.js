import { useState, useCallback } from "react";

/**
 * Custom Hook for copying text to clipboard with feedback state.
 * @param {number} resetDelay - Thời gian đặt lại trạng thái sao chép
 * @returns {object} { copiedId, copy }
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copiedId, setCopiedId] = useState(null);

  const copy = useCallback(
    (id, text, e) => {
      if (e && typeof e.stopPropagation === "function") {
        e.stopPropagation();
      }
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), resetDelay);
      });
    },
    [resetDelay]
  );

  return { copiedId, copy };
}
