import { useRef, useState } from "react";
import { AlertCircle, FileText, Paperclip, X } from "lucide-react";
import { toUserMessage } from "../../services/api";
import { uploadFormFile } from "../../services/formsService";
import { driveAvailable, pickFromDrive } from "../../utils/googleDrive";

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

// Google Drive's mark, drawn small beside the words.
function DriveMark() {
  return (
    <svg width="16" height="14" viewBox="0 0 87.3 78" aria-hidden="true">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
    </svg>
  );
}

export default function FileField({ slug, token, question, value, onChange, onBusyChange, invalid, describedBy }) {
  const inputRef = useRef(null);
  const [opening, setOpening] = useState(false);
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

  // Files from Google Drive go through the same checks and upload as any other.
  async function fromDrive() {
    setOpening(true);
    try {
      const chosen = await pickFromDrive({ multiple: room > 1 });
      if (chosen.length) await send(chosen);
    } catch (error) {
      setProblems([error?.message || "Google Drive could not be opened. Please try again."]);
    } finally {
      setOpening(false);
    }
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
        <div className="flex flex-wrap gap-2">
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
          {driveAvailable && (
            <button
              type="button"
              onClick={fromDrive}
              disabled={opening}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-4 text-[15px] font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)]/40 disabled:opacity-60"
            >
              <DriveMark />
              {opening ? "Opening Google Drive…" : "From Google Drive"}
            </button>
          )}
        </div>
      )}

      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        {maxFiles > 1 ? `Up to ${maxFiles} files` : "One file"}, {limitMb} MB each · PDF, photo, Word, Excel or PowerPoint
      </p>

      {problems.map((message) => (
        <p key={message} role="alert" className="mt-2 flex items-start gap-1.5 text-sm font-medium text-[var(--color-field-danger)]">
          <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>{message}</span>
        </p>
      ))}
    </div>
  );
}
