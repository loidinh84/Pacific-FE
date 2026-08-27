import { useState, useCallback } from "react";

/**
 * Custom Hook for copying text to clipboard with feedback state.
 * @param {number} resetDelay - Time in ms before copiedId resets to null (default 2000ms)
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
