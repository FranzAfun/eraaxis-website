import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";

/**
 * The site's dropdown, behaving as EDOS's does:
 * - the list floats over the page, below the field, or above it when there is
 *   more room there (measured against what is visible, so a phone keyboard
 *   never hides it), at least as wide as the field and wider for long names;
 * - a list longer than ten, or one searched on the server (the school register),
 *   opens with its search box ready to type into;
 * - the chosen option is shaded and ticked; the one under the pointer or the
 *   arrow keys is only lightly shaded;
 * - clicking away, Escape or choosing closes it, and what was typed is forgotten.
 */

const GAP = 8;
const EDGE = 8;
const MAX_LIST_HEIGHT = 256;
const MIN_LIST_HEIGHT = 120;
// Wide enough for a long school name, narrow enough to read.
const MAX_PANEL_WIDTH = 448;
const SEARCH_FROM = 10;

function createChangeEvent(name, value) {
  return {
    target: { name, value },
    currentTarget: { name, value },
  };
}

function nextEnabled(options, from, step) {
  if (!options.length) return -1;
  let index = from;
  for (let tries = 0; tries < options.length; tries += 1) {
    index = (index + step + options.length) % options.length;
    if (!options[index].disabled) return index;
  }
  return -1;
}

export default function SelectField({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  menuClassName = "",
  // Whether the list has a search box. By default: a list longer than ten, or
  // one searched on the server.
  searchable,
  // For a list too long to send whole, such as the school register: typing asks
  // the caller for results instead of filtering `options` here.
  onSearch,
  searching = false,
  searchPlaceholder = "Search…",
  // The chosen option may not be among the current results once somebody has
  // searched again, so the caller can say what the field should read.
  selectedLabel,
  emptyText = "No matches found.",
  // Under the results, when they are only the first few of many.
  moreHint,
  // Under the list, for a way out of it ("My school is not listed").
  footer,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}) {
  const searchesServer = typeof onSearch === "function";
  const allOptions = useMemo(
    () => (options || []).map((option) => ({
      ...option,
      value: option.value ?? "",
      label: option.label ?? "",
      disabled: Boolean(option.disabled),
    })),
    [options]
  );
  const isSearchable = searchesServer || (searchable ?? allOptions.length > SEARCH_FROM);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(-1);
  const [place, setPlace] = useState(null);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const searchRef = useRef(null);
  const queryRef = useRef("");

  const selectedValue = value ?? "";
  const selectedOption = allOptions.find((option) => String(option.value) === String(selectedValue)) || null;
  const triggerLabel = selectedOption?.label || (selectedValue !== "" && selectedLabel) || "";

  // The server has already matched its results (short names and all), so they
  // are shown as they come; a local list is matched by its words.
  const shown = useMemo(() => {
    if (searchesServer) return allOptions;
    const term = query.trim().toLowerCase();
    if (!term) return allOptions;
    return allOptions.filter((option) => option.label.toLowerCase().includes(term));
  }, [allOptions, query, searchesServer]);
  const activeIndex = highlighted < shown.length ? highlighted : -1;

  const close = useCallback(() => {
    setOpen(false);
    if (queryRef.current && searchesServer) onSearch("");
    queryRef.current = "";
    setQuery("");
  }, [onSearch, searchesServer]);

  function openMenu() {
    const selectedIndex = allOptions.findIndex((option) => String(option.value) === String(selectedValue));
    setHighlighted(selectedIndex >= 0 ? selectedIndex : -1);
    setOpen(true);
  }

  function choose(option) {
    if (option.disabled) return;
    onChange?.(createChangeEvent(name, option.value));
    close();
    triggerRef.current?.focus();
  }

  // Clicking away or Escape closes it.
  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!wrapperRef.current?.contains(event.target) && !panelRef.current?.contains(event.target)) close();
    }
    function onEscape(event) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, close]);

  // A searchable list opens ready to type into; any other takes the arrow keys.
  // Only once it is placed: it is hidden while it is first measured, and
  // nothing hidden can take the focus.
  const placed = Boolean(place);
  useEffect(() => {
    if (!open || !placed) return;
    if (isSearchable) searchRef.current?.focus({ preventScroll: true });
    else listRef.current?.focus({ preventScroll: true });
  }, [open, placed, isSearchable]);

  // Where the panel goes: measured against the field and against what can be
  // seen (on a phone the keyboard covers the page without changing its size).
  const updatePlace = useCallback(() => {
    const trigger = triggerRef.current?.getBoundingClientRect();
    const panel = panelRef.current;
    const list = listRef.current;
    if (!trigger) return;
    const visual = window.visualViewport;
    const visibleTop = visual ? visual.offsetTop : 0;
    const visibleBottom = visual ? visual.offsetTop + visual.height : window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceBelow = visibleBottom - trigger.bottom - GAP - EDGE;
    const spaceAbove = trigger.top - visibleTop - GAP - EDGE;
    const chrome = panel && list ? Math.max(0, panel.offsetHeight - list.offsetHeight) : 0;
    const preferredList = Math.min(list ? list.scrollHeight : MAX_LIST_HEIGHT, MAX_LIST_HEIGHT);
    const preferred = chrome + preferredList;

    let direction;
    if (preferred <= spaceBelow) direction = "down";
    else if (preferred <= spaceAbove) direction = "up";
    else direction = spaceAbove > spaceBelow ? "up" : "down";
    const available = direction === "down" ? spaceBelow : spaceAbove;
    const listMax = Math.round(Math.min(preferredList, Math.max(MIN_LIST_HEIGHT, available - chrome)));

    // Never narrower than its field; wider only up to a readable width.
    const maxWidth = Math.round(Math.min(Math.max(MAX_PANEL_WIDTH, trigger.width), viewportWidth - EDGE * 2));
    const minWidth = Math.round(Math.min(trigger.width, maxWidth));
    const width = panel ? Math.round(Math.min(Math.max(panel.offsetWidth, minWidth), maxWidth)) : minWidth;
    const left = Math.round(Math.min(Math.max(EDGE, trigger.left), viewportWidth - width - EDGE));
    const next = {
      listMax,
      left,
      minWidth,
      maxWidth,
      top: direction === "down" ? Math.round(trigger.bottom + GAP) : null,
      bottom: direction === "up" ? Math.round(window.innerHeight - trigger.top + GAP) : null,
    };
    setPlace((current) => (current && Object.keys(next).every((key) => current[key] === next[key]) ? current : next));
  }, []);

  useLayoutEffect(() => {
    if (!open) return undefined;
    updatePlace();
    window.addEventListener("resize", updatePlace);
    window.addEventListener("scroll", updatePlace, true);
    window.visualViewport?.addEventListener("resize", updatePlace);
    window.visualViewport?.addEventListener("scroll", updatePlace);
    return () => {
      window.removeEventListener("resize", updatePlace);
      window.removeEventListener("scroll", updatePlace, true);
      window.visualViewport?.removeEventListener("resize", updatePlace);
      window.visualViewport?.removeEventListener("scroll", updatePlace);
    };
  }, [open, shown.length, isSearchable, updatePlace]);

  // The highlighted row stays in view as the arrow keys move it.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  function onTriggerKeyDown(event) {
    if (disabled) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) openMenu();
    }
  }

  function onListKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted(nextEnabled(shown, activeIndex < 0 ? -1 : activeIndex, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted(nextEnabled(shown, activeIndex < 0 ? 0 : activeIndex, -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const index = activeIndex >= 0 ? activeIndex : shown.findIndex((option) => !option.disabled);
      if (index >= 0) choose(shown[index]);
    } else if (event.key === "Tab") {
      close();
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full min-w-0">
      <input type="hidden" id={id} name={name} value={selectedValue} />

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={[
          "flex w-full min-w-0 items-center justify-between gap-3 text-left",
          className,
          disabled ? "cursor-not-allowed opacity-100" : "cursor-pointer",
        ].join(" ")}
      >
        <span className={`min-w-0 truncate ${triggerLabel ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>
          {triggerLabel || placeholder}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          className={[
            "select-menu fixed z-[80] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-white shadow-[0_20px_60px_rgba(17,17,17,0.12)]",
            menuClassName,
          ].join(" ")}
          style={{
            left: place?.left ?? 0,
            top: place?.top ?? undefined,
            bottom: place?.bottom ?? undefined,
            width: "max-content",
            minWidth: place?.minWidth,
            maxWidth: place?.maxWidth,
            // Measured once on the first frame, then shown where it belongs.
            visibility: place ? "visible" : "hidden",
          }}
        >
          {isSearchable && (
            <div className="border-b border-[var(--color-border-soft)] p-2">
              <label className="select-search flex items-center gap-2 rounded-[calc(var(--radius-sm)-2px)] border border-[var(--color-border-soft)] bg-white px-3 transition-colors focus-within:border-[var(--color-primary)]">
                <Search size={15} aria-hidden="true" className="shrink-0 text-[var(--color-text-muted)]" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  autoComplete="off"
                  aria-label={searchPlaceholder}
                  placeholder={searchPlaceholder}
                  onKeyDown={onListKeyDown}
                  onChange={(event) => {
                    queryRef.current = event.target.value;
                    setQuery(event.target.value);
                    setHighlighted(-1);
                    if (searchesServer) onSearch(event.target.value);
                  }}
                  className="min-h-[40px] w-full min-w-0 bg-transparent text-base text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] sm:text-sm"
                />
              </label>
            </div>
          )}

          <div
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            onKeyDown={onListKeyDown}
            className="select-list overflow-y-auto p-1.5 outline-none"
            style={{ maxHeight: `${place?.listMax ?? MAX_LIST_HEIGHT}px` }}
          >
            {shown.length === 0 && (
              <p className="px-3 py-2.5 text-sm text-[var(--color-text-muted)]">{searching ? "Searching…" : emptyText}</p>
            )}
            {shown.map((option, index) => {
              const isSelected = String(option.value) === String(selectedValue);
              const isHighlighted = index === activeIndex;
              return (
                <button
                  key={`${String(option.value)}-${option.label}`}
                  type="button"
                  role="option"
                  data-index={index}
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => choose(option)}
                  className={[
                    "flex w-full items-center justify-between gap-3 rounded-[calc(var(--radius-sm)-2px)] px-3 py-2 text-left text-sm text-[var(--color-text-primary)] transition-colors",
                    option.disabled
                      ? "cursor-not-allowed opacity-50"
                      : isSelected
                        ? "bg-[var(--color-primary)]/10"
                        : isHighlighted
                          ? "bg-[var(--color-primary)]/6"
                          : "hover:bg-[var(--color-primary)]/6",
                  ].join(" ")}
                >
                  <span className="min-w-0">
                    <span className="block break-words">{option.label}</span>
                    {option.hint && <span className="block break-words text-xs text-[var(--color-text-muted)]">{option.hint}</span>}
                  </span>
                  {isSelected && <Check size={15} strokeWidth={2.3} aria-hidden="true" className="shrink-0 text-[var(--color-primary)]" />}
                </button>
              );
            })}
            {moreHint && shown.length > 0 && (
              <p className="px-3 pb-1 pt-2 text-sm text-[var(--color-text-secondary)]">{moreHint}</p>
            )}
          </div>

          {footer && <div className="border-t border-[var(--color-border-soft)] p-1.5">{footer}</div>}
        </div>,
        document.body
      )}
    </div>
  );
}
