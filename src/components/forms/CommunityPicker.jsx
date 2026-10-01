import { useCallback, useEffect, useRef, useState } from "react";
import SelectField from "../ui/SelectField";
import { searchFormCommunities } from "../../services/formsService";

/**
 * Choose your community from the ones ERA AXIS has recorded, or type it.
 *
 * Communities have no official list, so this is what we have recorded so far.
 * Anybody whose community is not there types it, and it becomes a community
 * record that the next person from the same place can choose.
 */
export default function CommunityPicker({ slug, question, value, onChange, fieldClass, invalid, describedBy }) {
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [typing, setTyping] = useState(Boolean(value?.other));
  const request = useRef(0);
  const timer = useRef(null);

  const search = useCallback(
    (query) => {
      const ticket = ++request.current;
      clearTimeout(timer.current);
      timer.current = setTimeout(
        async () => {
          setSearching(true);
          try {
            const items = await searchFormCommunities(slug, question.key, query);
            if (ticket === request.current) setResults(items);
          } catch {
            if (ticket === request.current) setResults([]);
          } finally {
            if (ticket === request.current) setSearching(false);
          }
        },
        query ? 250 : 0
      );
    },
    [slug, question.key]
  );

  useEffect(() => {
    if (!typing) search("");
    return () => clearTimeout(timer.current);
  }, [search, typing]);

  if (typing) {
    return (
      <div className="space-y-2">
        <input
          id={`q-${question.key}`}
          type="text"
          value={value?.other || ""}
          maxLength={160}
          placeholder="Type your community's name"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={fieldClass}
          onChange={(event) => onChange(event.target.value ? { other: event.target.value } : null)}
        />
        <button
          type="button"
          className="text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2"
          onClick={() => {
            setTyping(false);
            onChange(null);
          }}
        >
          Choose from the list instead
        </button>
      </div>
    );
  }

  return (
    <SelectField
      id={`q-${question.key}`}
      name={question.key}
      className={fieldClass}
      value={value?.communityId || ""}
      placeholder="Choose your community"
      selectedLabel={value?.name || ""}
      options={results.map((item) => ({ value: item.id, label: item.name, hint: item.region || "" }))}
      onSearch={search}
      searching={searching}
      searchPlaceholder="Search for your community"
      emptyText="No community by that name yet. You can type it instead."
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onChange={(event) => {
        const community = results.find((item) => item.id === event.target.value);
        onChange(event.target.value ? { communityId: event.target.value, name: community?.name || "" } : null);
      }}
      footer={
        <button
          type="button"
          className="w-full rounded-[calc(var(--radius-sm)-2px)] px-3 py-2.5 text-left text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-surface-soft)]"
          onClick={() => {
            setTyping(true);
            onChange(null);
          }}
        >
          My community is not listed
        </button>
      }
    />
  );
}
