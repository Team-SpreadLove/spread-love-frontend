import { useCallback } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

const getFocusableElements = (container) => {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) => element.offsetParent !== null && !element.hasAttribute("disabled"),
  );
};

const useFocusTrap = (containerRef) => {
  return useCallback(
    (event) => {
      if (event.key !== "Tab") return;

      const container = containerRef.current;

      if (!container) return;

      const focusable = getFocusableElements(container);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const isFirst = document.activeElement === first;
      const isLast = document.activeElement === last;

      if (event.shiftKey && isFirst) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && isLast) {
        event.preventDefault();
        first.focus();
      }
    },
    [containerRef],
  );
};

export default useFocusTrap;
