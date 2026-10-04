import { useCallback, useEffect, useRef, useState } from "react";
import SelectField from "../ui/SelectField";
import { searchFormSchools } from "../../services/formsService";

/**
 * Choose a school from the published register instead of typing one.
 *
 * It is the site's own dropdown with a search box at the top. The search is asked
 * of the server, which knows the short names, so "KNUST", "K.N.U.S.T." and the
 * full name all find the same school.
 *
 * Nobody is ever stopped by the list. "My school is not listed" is always there
 * when the question allows it, and what they type is passed to our team.
 */
// The kind of school, asked only for one that is not listed: it decides
// whether a parent or guardian has to agree.
const UNLISTED_LEVELS = [
  { value: "basic", label: "Basic school (primary)" },
  { value: "junior_high", label: "Junior high school" },
  { value: "senior_high", label: "Senior high school" },
  { value: "tertiary", label: "University or college" },
];

/**
 * `searchSchools` replaces the form's own school list (the sign-up pages search
 * every register); `askLevel` asks the kind of school when it is not listed.
 * The chosen school carries its level.
 */
export default function SchoolPicker({ slug, question, value, onChange, fieldClass, invalid, describedBy, searchSchools, askLevel = false, placeholder = "Choose your school" }) {
  const allowOther = question.school?.allowOther !== false;
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [failed, setFailed] = useState(false);
  const [typing, setTyping] = useState(Boolean(value?.other));
  const request = useRef(0);
  const timer = useRef(null);

  const search = useCallback(
    (query) => {
      const ticket = ++request.current;
      clearTimeout(timer.current);
      // A pause before asking: somebody typing a school name types the whole thing.
      timer.current = setTimeout(
        async () => {
          setSearching(true);
          try {
            const items = searchSchools ? await searchSchools(query) : await searchFormSchools(slug, question.key, query);
            if (ticket !== request.current) return;
            setResults(items);
            setFailed(false);
          } catch {
            if (ticket === request.current) {
              setResults([]);
              setFailed(true);
            }
          } finally {
            if (ticket === request.current) setSearching(false);
          }
        },
        query ? 250 : 0
      );
    },
    [slug, question.key, searchSchools]
  );

  // The first page is fetched before the menu opens, so it never opens empty.
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
          maxLength={240}
          autoComplete="organization"
          placeholder="Type your school's full name"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={fieldClass}
          onChange={(event) => onChange(event.target.value ? { other: event.target.value, level: value?.level || "" } : null)}
        />
        {askLevel && (
          <SelectField
            id={`q-${question.key}-level`}
            name={`${question.key}-level`}
            className={fieldClass}
            value={value?.level || ""}
            placeholder="What kind of school is it?"
            options={UNLISTED_LEVELS}
            aria-invalid={(invalid && !value?.level) || undefined}
            onChange={(event) => onChange({ other: value?.other || "", level: event.target.value })}
          />
        )}
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
      value={value?.schoolId || ""}
      placeholder={placeholder}
      // The chosen school travels with the answer, so it still reads correctly
      // after a search that no longer lists it, or when a saved form is reopened.
      selectedLabel={value?.name || ""}
      options={results.map((item) => ({
        value: item.id,
        label: item.name,
        hint: [item.shortName, item.region].filter(Boolean).join(" · "),
      }))}
      onSearch={search}
      searching={searching}
      searchPlaceholder="Search by name or short name"
      // The server sends twenty at most; a full twenty means there are more.
      moreHint={results.length >= 20 ? "Showing the first 20. Type the school's name to find yours." : null}
      emptyText={
        failed
          ? allowOther
            ? "The list couldn't be reached just now. You can type your school instead."
            : "The list couldn't be reached just now. Please try again in a moment."
          : "No school matches that."
      }
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onChange={(event) => {
        const school = results.find((item) => item.id === event.target.value);
        onChange(event.target.value ? { schoolId: event.target.value, name: school?.name || "", level: school?.level || "" } : null);
      }}
      footer={
        allowOther ? (
          <button
            type="button"
            className="w-full rounded-[calc(var(--radius-sm)-2px)] px-3 py-2.5 text-left text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-surface-soft)]"
            onClick={() => {
              setTyping(true);
              onChange(null);
            }}
          >
            My school is not listed
          </button>
        ) : null
      }
    />
  );
}
