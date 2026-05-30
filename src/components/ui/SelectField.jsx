import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

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
}) {
  const MENU_MAX_HEIGHT = 192;
  const VIEWPORT_GAP = 12;
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState(null);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);

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

  function getInitialHighlightIndex() {
    return selectedIndex >= 0 && !normalizedOptions[selectedIndex]?.disabled
      ? selectedIndex
      : normalizedOptions.findIndex((option) => !option.disabled);
  }

  function resolveMenuPosition(rect) {
    if (!rect) return null;

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_GAP;
    const spaceAbove = rect.top - VIEWPORT_GAP;
    const shouldOpenUp =
      spaceBelow < MENU_MAX_HEIGHT && spaceAbove > spaceBelow;
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

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
  }, [open, normalizedOptions, selectedIndex]);

  useEffect(() => {
    if (!open) return undefined;

    function updateMenuPosition() {
      const rect = triggerRef.current?.getBoundingClientRect();

      if (!rect) return;

      setMenuPosition(resolveMenuPosition(rect));
    }

    const frameId = window.requestAnimationFrame(updateMenuPosition);

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open]);

  function selectOption(optionValue) {
    onChange?.(createChangeEvent(name, optionValue));
    setOpen(false);
  }

  function openMenu() {
    const rect = triggerRef.current?.getBoundingClientRect();

    setHighlightedIndex(getInitialHighlightIndex());
    setMenuPosition(resolveMenuPosition(rect));
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
        setOpen(false);
      } else {
        openMenu();
      }
    }
  }

  function handleListKeyDown(event) {
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) =>
        getNextEnabledIndex(
          normalizedOptions,
          current < 0 ? -1 : current,
          1
        )
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) =>
        getNextEnabledIndex(
          normalizedOptions,
          current < 0 ? 0 : current,
          -1
        )
      );
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (
        highlightedIndex >= 0 &&
        normalizedOptions[highlightedIndex] &&
        !normalizedOptions[highlightedIndex].disabled
      ) {
        selectOption(normalizedOptions[highlightedIndex].value);
      }
    }

    if (event.key === "Tab") {
      setOpen(false);
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
        disabled={disabled}
        onClick={() => {
          if (open) {
            setOpen(false);
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
            selectedOption
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-text-muted)]"
          }`}
        >
          {selectedOption?.label || placeholder}
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
          <div
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            className="overflow-y-auto p-1.5 outline-none"
            style={{ maxHeight: `${menuPosition.maxHeight}px` }}
          >
            {normalizedOptions.map((option, index) => {
              const isSelected =
                String(option.value) === String(selectedValue);
              const isHighlighted = index === highlightedIndex;

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
                  <span className="min-w-0 truncate">{option.label}</span>
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
        </div>,
        document.body
      )}
    </div>
  );
}
