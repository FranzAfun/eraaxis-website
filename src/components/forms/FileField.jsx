import { useRef, useState } from "react";
import { AlertCircle, FileText, Paperclip, X } from "lucide-react";
import { toUserMessage } from "../../services/api";
import { uploadFormFile } from "../../services/formsService";

/**
 * Attaching files to a form, one at a time or several at once.
 *
 * Each file goes up the moment it is chosen, with its progress shown, so sending
 * the form at the end is quick and a slow connection is visible rather than a
 * frozen button. Size and type are checked here first to spare somebody a wait
 * for a refusal, and checked again on the server, which is the check that counts.
 */

// What the server accepts (utils/formUploads.js). Kept to the same list so the
// phone's own file picker offers only what will go through.
const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv";
const ALLOWED = new Set(ACCEPT.split(","));
const DEFAULT_MB = 10;
const CEILING_MB = 25;

const readableSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
const extensionOf = (name) => {
  const at = String(name || "").lastIndexOf(".");
  return at === -1 ? "" : String(name).slice(at).toLowerCase();
};

export default function FileField({ slug, token, question, value, onChange, onBusyChange, invalid, describedBy }) {
  const inputRef = useRef(null);
  const [uploads, setUploads] = useState([]);
  const [problems, setProblems] = useState([]);
  const files = Array.isArray(value) ? value : [];
  const maxFiles = question.file?.maxFiles || 1;
  const limitMb = Math.min(CEILING_MB, question.file?.maxSizeMb || DEFAULT_MB);
  const room = maxFiles - files.length - uploads.length;

  async function send(chosen) {
    const accepted = [];
    const refused = [];
    for (const file of chosen) {
      if (!ALLOWED.has(extensionOf(file.name))) {
        refused.push(`${file.name} can't be attached. Please use a PDF, a photo, or a Word, Excel or PowerPoint file.`);
      } else if (file.size > limitMb * 1024 * 1024) {
        refused.push(`${file.name} is larger than ${limitMb} MB.`);
      } else if (accepted.length >= room) {
        refused.push(`Only ${maxFiles} file${maxFiles === 1 ? "" : "s"} can be attached here.`);
      } else {
        accepted.push(file);
      }
    }
    setProblems(refused);
    if (!accepted.length) return;

    const pending = accepted.map((file) => ({ id: `${file.name}-${file.size}-${Math.random()}`, name: file.name, share: 0 }));
    setUploads((current) => [...current, ...pending]);
    onBusyChange?.(true);

    const done = [];
    await Promise.all(accepted.map(async (file, index) => {
      const id = pending[index].id;
      try {
        const result = await uploadFormFile(slug, question.key, file, token, (share) => {
          setUploads((current) => current.map((item) => (item.id === id ? { ...item, share } : item)));
        });
        if (result.error) setProblems((current) => [...current, `${file.name}: ${result.error}`]);
        else done.push(result);
      } catch (error) {
        setProblems((current) => [...current, `${file.name}: ${toUserMessage(error)}`]);
      } finally {
        setUploads((current) => current.filter((item) => item.id !== id));
      }
    }));

    onBusyChange?.(false);
    if (done.length) onChange([...files, ...done]);
  }

  return (
    <div>
      {(files.length > 0 || uploads.length > 0) && (
        <ul className="mb-3 space-y-2">
          {files.map((file) => (
            <li key={file.key} className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-3 py-2.5">
              <FileText size={18} aria-hidden="true" className="shrink-0 text-[var(--color-primary)]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] text-[var(--color-text-primary)]">{file.name}</span>
                <span className="block text-xs text-[var(--color-text-muted)]">{readableSize(file.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => onChange(files.filter((item) => item.key !== file.key))}
                aria-label={`Remove ${file.name}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
          {uploads.map((upload) => (
            <li key={upload.id} className="rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] px-3 py-2.5" aria-live="polite">
              <span className="block truncate text-[15px] text-[var(--color-text-secondary)]">{upload.name}</span>
              <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-soft)]" aria-hidden="true">
                <span className="block h-full rounded-full bg-[var(--color-primary)] transition-all" style={{ width: `${Math.round(upload.share * 100)}%` }} />
              </span>
              <span className="mt-1 block text-xs text-[var(--color-text-muted)]">Uploading… {Math.round(upload.share * 100)}%</span>
            </li>
          ))}
        </ul>
      )}

      {room > 0 && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-4 text-[15px] font-semibold text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)]/40"
          >
            <Paperclip size={16} aria-hidden="true" />
            {files.length ? "Add another file" : "Add file"}
          </button>
          <input
            ref={inputRef}
            id={`q-${question.key}`}
            type="file"
            accept={ACCEPT}
            multiple={room > 1}
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => {
              const chosen = [...(event.target.files || [])];
              // Cleared, so choosing the same file again after removing it still
              // counts as a choice.
              event.target.value = "";
              if (chosen.length) send(chosen);
            }}
          />
        </>
      )}

      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        {maxFiles > 1 ? `Up to ${maxFiles} files` : "One file"}, {limitMb} MB each · PDF, photo, Word, Excel or PowerPoint
      </p>

      {problems.map((message) => (
        <p key={message} role="alert" className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-600">
          <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>{message}</span>
        </p>
      ))}
    </div>
  );
}
