import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";

function createChangeEvent(name, value) {
  return {
    target: { name, value },
    currentTarget: { name, value },
  };
}

function getNextEnabledIndex(options, startIndex, direction) {
  if (options.length === 0) return -1;

  let nextIndex = startIndex;

  for (let step = 0; step < options.length; step += 1) {
    nextIndex = (nextIndex + direction + options.length) % options.length;

    if (!options[nextIndex].disabled) {
      return nextIndex;
    }
  }

  return -1;
}

const MENU_MAX_HEIGHT = 192;
const VIEWPORT_GAP = 12;

// Where the menu goes: below the field if the list fits there, above it if there
// is more room above. `menuChrome` is the height of the search box and footer.
function resolveMenuPosition(rect, menuChrome) {
  if (!rect) return null;

  // What the person can actually see. On a phone the keyboard covers the
  // bottom of the page without changing window.innerHeight, so the visual
  // viewport is the one to measure against.
  const visual = window.visualViewport;
  const visibleTop = visual ? visual.offsetTop : 0;
  const visibleBottom = visual ? visual.offsetTop + visual.height : window.innerHeight;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const spaceBelow = visibleBottom - rect.bottom - VIEWPORT_GAP;
  const spaceAbove = rect.top - visibleTop - VIEWPORT_GAP;
  const wanted = MENU_MAX_HEIGHT + menuChrome;
  const shouldOpenUp = spaceBelow < wanted && spaceAbove > spaceBelow;
  const width = Math.min(rect.width, viewportWidth - VIEWPORT_GAP * 2);
  const left = Math.max(
    VIEWPORT_GAP,
    Math.min(rect.left, viewportWidth - width - VIEWPORT_GAP)
  );

  return {
    left,
    width,
    maxHeight: Math.max(120, shouldOpenUp ? spaceAbove : spaceBelow),
    ...(shouldOpenUp
      ? { bottom: viewportHeight - rect.top + 8 }
      : { top: rect.bottom + 8 }),
  };
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
  // For a list too long to send whole, such as the school register. When
  // `onSearch` is given the menu opens with a search box, and typing asks the
  // caller for results rather than filtering `options` here. Every other
  // dropdown on the site leaves these out and behaves exactly as before.
  onSearch,
  searching = false,
  searchPlaceholder = "Search…",
  // The chosen option may not be among the current results once somebody has
  // searched again, so the caller can say what the trigger should read.
  selectedLabel,
  emptyText = "No matches found.",
  // Shown under the list, for a way out of it ("My school is not listed").
  footer,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}) {
  const searchesServer = typeof onSearch === "function";
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState(null);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  // The search box lives in the menu and goes with it, so its text resets by
  // itself; this only remembers whether the caller has to be told.
  const queryRef = useRef("");

  const normalizedOptions = useMemo(
    () =>
      (options || []).map((option) => ({
        ...option,
        value: option.value ?? "",
        label: option.label ?? "",
        disabled: Boolean(option.disabled),
      })),
    [options]
  );

  const selectedValue = value ?? "";
  const selectedIndex = normalizedOptions.findIndex(
    (option) => String(option.value) === String(selectedValue)
  );
  const selectedOption =
    selectedIndex >= 0 ? normalizedOptions[selectedIndex] : null;
  const triggerLabel =
    selectedOption?.label || (selectedValue !== "" && selectedLabel) || "";
  // Results change under the highlight as somebody types.
  const activeIndex =
    highlightedIndex < normalizedOptions.length ? highlightedIndex : -1;

  const closeMenu = useCallback(() => {
    setOpen(false);
    // The next opening starts from the whole list, not from an old search.
    if (queryRef.current && searchesServer) onSearch("");
    queryRef.current = "";
  }, [onSearch, searchesServer]);

  function getInitialHighlightIndex() {
    return selectedIndex >= 0 && !normalizedOptions[selectedIndex]?.disabled
      ? selectedIndex
      : normalizedOptions.findIndex((option) => !option.disabled);
  }

  // The search box and the footer are part of the menu too, so they count when
  // deciding whether it fits below the field.
  const menuChrome = (searchesServer ? 53 : 0) + (footer ? 53 : 0);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (
        !wrapperRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        closeMenu();
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, closeMenu]);

  // With a search box, focus stays in it while results come and go.
  useEffect(() => {
    if (!open || !searchesServer) return;
    searchRef.current?.focus();
  }, [open, searchesServer]);

  useEffect(() => {
    if (!open || searchesServer) return;
    listRef.current?.focus();
  }, [open, searchesServer, normalizedOptions, selectedIndex]);

  useEffect(() => {
    if (!open) return undefined;

    function updateMenuPosition() {
      const rect = triggerRef.current?.getBoundingClientRect();

      if (!rect) return;

      setMenuPosition(resolveMenuPosition(rect, menuChrome));
    }

    const frameId = window.requestAnimationFrame(updateMenuPosition);

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    // The keyboard opening or closing resizes only the visual viewport.
    window.visualViewport?.addEventListener("resize", updateMenuPosition);
    window.visualViewport?.addEventListener("scroll", updateMenuPosition);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      window.visualViewport?.removeEventListener("resize", updateMenuPosition);
      window.visualViewport?.removeEventListener("scroll", updateMenuPosition);
    };
  }, [open, menuChrome]);

  function selectOption(optionValue) {
    onChange?.(createChangeEvent(name, optionValue));
    closeMenu();
    triggerRef.current?.focus();
  }

  function openMenu() {
    let rect = triggerRef.current?.getBoundingClientRect();

    // A searchable list on a phone needs room below it for the results and, once
    // the search box has focus, for the keyboard. Bring the field up near the top
    // first, clear of the fixed header, rather than squeezing the list in.
    if (searchesServer && rect && window.innerWidth < 640) {
      const roomBelow = window.innerHeight - rect.bottom;
      if (roomBelow < 420) {
        window.scrollBy({ top: rect.top - 96, behavior: "instant" });
        rect = triggerRef.current?.getBoundingClientRect();
      }
    }

    setHighlightedIndex(getInitialHighlightIndex());
    setMenuPosition(resolveMenuPosition(rect, menuChrome));
    setOpen(true);
  }

  function handleTriggerKeyDown(event) {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu();
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) {
        closeMenu();
      } else {
        openMenu();
      }
    }
  }

  function handleListKeyDown(event) {
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex(
        getNextEnabledIndex(normalizedOptions, activeIndex < 0 ? -1 : activeIndex, 1)
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex(
        getNextEnabledIndex(normalizedOptions, activeIndex < 0 ? 0 : activeIndex, -1)
      );
    }

    // In the search box a space is part of the name being typed.
    const choosing =
      event.key === "Enter" || (event.key === " " && event.currentTarget !== searchRef.current);

    if (choosing) {
      event.preventDefault();
      const index =
        activeIndex >= 0
          ? activeIndex
          : normalizedOptions.findIndex((option) => !option.disabled);

      if (index >= 0 && !normalizedOptions[index].disabled) {
        selectOption(normalizedOptions[index].value);
      }
    }

    if (event.key === "Tab") {
      closeMenu();
    }
  }

  const listMaxHeight = menuPosition
    ? Math.max(96, menuPosition.maxHeight - menuChrome)
    : MENU_MAX_HEIGHT;

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
        onClick={() => {
          if (open) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        className={[
          "flex w-full min-w-0 items-center justify-between gap-3 text-left",
          className,
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        ].join(" ")}
      >
        <span
          className={`min-w-0 truncate ${
            triggerLabel
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-text-muted)]"
          }`}
        >
          {triggerLabel || placeholder}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && menuPosition && createPortal(
          <div
            ref={menuRef}
            className={[
              "fixed z-[70] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-white shadow-[0_20px_60px_rgba(17,17,17,0.12)]",
              menuClassName,
          ].join(" ")}
          style={{
            ...(menuPosition.top !== undefined
              ? { top: `${menuPosition.top}px` }
              : {}),
            ...(menuPosition.bottom !== undefined
              ? { bottom: `${menuPosition.bottom}px` }
              : {}),
            left: `${menuPosition.left}px`,
            width: `${menuPosition.width}px`,
          }}
        >
          {searchesServer && (
            <div className="border-b border-[var(--color-border-soft)] p-1.5">
              <label className="flex items-center gap-2 rounded-[calc(var(--radius-sm)-2px)] bg-[var(--color-surface-soft)] px-3">
                <Search size={15} aria-hidden="true" className="shrink-0 text-[var(--color-text-muted)]" />
                <input
                  ref={searchRef}
                  type="text"
                  autoComplete="off"
                  aria-label={searchPlaceholder}
                  placeholder={searchPlaceholder}
                  onKeyDown={handleListKeyDown}
                  onChange={(event) => {
                    queryRef.current = event.target.value;
                    setHighlightedIndex(0);
                    onSearch(event.target.value);
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
            onKeyDown={handleListKeyDown}
            className="overflow-y-auto p-1.5 outline-none"
            style={{ maxHeight: `${listMaxHeight}px` }}
          >
            {normalizedOptions.length === 0 && (
              <p className="px-3 py-2.5 text-sm text-[var(--color-text-muted)]">
                {searching ? "Searching…" : emptyText}
              </p>
            )}
            {normalizedOptions.map((option, index) => {
              const isSelected =
                String(option.value) === String(selectedValue);
              const isHighlighted = index === activeIndex;

              return (
                <button
                  key={`${String(option.value)}-${option.label}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => {
                    if (!option.disabled) {
                      selectOption(option.value);
                    }
                  }}
                  className={[
                    "flex w-full items-center justify-between gap-3 rounded-[calc(var(--radius-sm)-2px)] px-3 py-2 text-left text-sm transition-colors",
                    option.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "",
                    isSelected || isHighlighted
                      ? "bg-[var(--color-primary)]/8 text-[var(--color-primary-deep)]"
                      : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)]",
                  ].join(" ")}
                >
                  <span className="min-w-0">
                    <span className="block break-words">{option.label}</span>
                    {option.hint && (
                      <span className="block break-words text-xs text-[var(--color-text-muted)]">
                        {option.hint}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <Check
                      size={15}
                      strokeWidth={2.3}
                      aria-hidden="true"
                      className="shrink-0 text-[var(--color-primary)]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {footer && (
            <div className="border-t border-[var(--color-border-soft)] p-1.5">{footer}</div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
