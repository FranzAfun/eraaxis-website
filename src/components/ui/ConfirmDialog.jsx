import { useCallback, useEffect, useRef } from "react";

export default function ConfirmDialog({
  open,
  title = "Leave without saving?",
  message = "You have unsaved changes. If you leave now they will be lost.",
  confirmLabel = "Leave",
  cancelLabel = "Stay on page",
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const cancelBtnRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onCancel]
  );

  useEffect(() => {
    if (open && cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" role="presentation">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="relative z-10 w-full max-w-md rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-[0_20px_60px_rgba(17,17,17,0.18)]"
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-desc"
          className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]"
        >
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="btn-primary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-outline"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
