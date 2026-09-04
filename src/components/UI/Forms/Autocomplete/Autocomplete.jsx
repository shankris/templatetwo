"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, MapPin, X } from "lucide-react";

import Field from "../shared/Field/Field";
import styles from "./Autocomplete.module.css";
import data from "./data.json";
import users from "./users.json";

const DEBOUNCE_DELAY = 500;
const MAX_RESULTS = 8;
const MAX_INITIAL_RESULTS = 20;

/* --------------------------------------------------
   Autocomplete Component
-------------------------------------------------- */

export default function Autocomplete({ instances }) {
  /*
   * If instances are supplied by components.json,
   * render each configured version.
   *
   * Otherwise use the default field from data.json.
   */
  const fields = instances?.length > 0 ? instances : [data.fields[0]];

  return (
    <>
      {fields.map((field) => (
        <AutocompleteField
          key={field.id}
          field={field}
        />
      ))}
    </>
  );
}

/* --------------------------------------------------
   Autocomplete Field
-------------------------------------------------- */

function AutocompleteField({ field, value, onChange, width = "100%" }) {
  const { id, label, placeholder = "Start typing...", required = false, helperText, helpText, variant = "simple" } = field;

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(value || null);
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  /* --------------------------------------------------
     Initial Suggestions
  -------------------------------------------------- */

  const initialResults = users.results.slice(0, MAX_INITIAL_RESULTS);

  /* --------------------------------------------------
     User Display Helpers
  -------------------------------------------------- */

  const getName = (user) => `${user.name.first} ${user.name.last}`;

  const getBirthday = (user) =>
    new Date(user.dob.date).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getLocation = (user) => `${user.location.city}, ${user.location.country}`;

  /* --------------------------------------------------
     Search Users
  -------------------------------------------------- */

  useEffect(() => {
    /*
     * When the input is empty, the initial suggestions
     * are handled by the focus event.
     */
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const search = query.toLowerCase().trim();

      const matches = users.results
        .filter((user) => {
          const name = `${user.name.first} ${user.name.last}`.toLowerCase();

          const email = user.email.toLowerCase();

          return name.includes(search) || email.includes(search);
        })
        .slice(0, MAX_RESULTS);

      setResults(matches);
      setIsOpen(matches.length > 0);
      setActiveIndex(-1);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [query]);

  /* --------------------------------------------------
     Close Suggestions
  -------------------------------------------------- */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* --------------------------------------------------
     Select User
  -------------------------------------------------- */

  const handleSelect = (user) => {
    setSelected(user);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);

    onChange?.(user);
  };

  /* --------------------------------------------------
     Clear Selection
  -------------------------------------------------- */

  const handleClear = () => {
    setSelected(null);
    setQuery("");
    setResults(initialResults);
    setIsOpen(true);
    setActiveIndex(-1);

    onChange?.(null);

    inputRef.current?.focus();
  };

  /* --------------------------------------------------
     Input Focus
  -------------------------------------------------- */

  const handleFocus = () => {
    /*
     * With an empty input, show the initial 20 users.
     */
    if (!query.trim()) {
      setResults(initialResults);
      setIsOpen(true);
      setActiveIndex(-1);
      return;
    }

    /*
     * If the user has entered text and search results
     * already exist, reopen the suggestion list.
     */
    if (results.length) {
      setIsOpen(true);
    }
  };

  /* --------------------------------------------------
     Keyboard Navigation
  -------------------------------------------------- */

  const handleKeyDown = (event) => {
    if (!isOpen || !results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((current) => (current < results.length - 1 ? current + 1 : 0));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((current) => (current > 0 ? current - 1 : results.length - 1));
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();

      handleSelect(results[activeIndex]);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <Field
      id={id}
      label={label}
      required={required}
      helperText={helperText}
      helpText={helpText}
      variant='vertical'
      width={width}
    >
      <div
        ref={containerRef}
        className={styles.autocomplete}
      >
        {/* --------------------------------------------------
           Selected User
        -------------------------------------------------- */}

        {selected ? (
          <div className={styles.selected}>
            {variant === "rich" && (
              <img
                src={selected.picture.medium}
                alt=''
                className={styles.avatar}
              />
            )}

            <div className={styles.selectedContent}>
              <span className={styles.selectedName}>
                <span>{selected.name.first}</span> <span className={styles.lastName}>{selected.name.last.toUpperCase()}</span>
              </span>

              {variant === "rich" && (
                <span className={styles.selectedDetails}>
                  <span className={styles.detailItem}>
                    <CalendarDays size={13} />
                    {getBirthday(selected)}
                  </span>

                  <span className={styles.detailSeparator}>·</span>

                  <span>{selected.dob.age}</span>

                  <span className={styles.detailSeparator}>·</span>

                  <span className={styles.detailItem}>
                    <MapPin size={13} />
                    {getLocation(selected)}
                  </span>
                </span>
              )}
            </div>

            <button
              type='button'
              className={styles.clear}
              aria-label='Clear selection'
              onClick={handleClear}
            >
              <X
                size={16}
                strokeWidth={2}
              />
            </button>
          </div>
        ) : (
          <>
            {/* --------------------------------------------------
               Search Input
            -------------------------------------------------- */}

            <input
              ref={inputRef}
              id={id}
              name={id}
              type='text'
              value={query}
              placeholder={placeholder}
              required={required}
              autoComplete='off'
              onChange={(event) => setQuery(event.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              className={styles.input}
            />

            {/* --------------------------------------------------
               Suggestions
            -------------------------------------------------- */}

            {isOpen && results.length > 0 && (
              <div className={styles.results}>
                {results.map((user, index) => (
                  <button
                    type='button'
                    key={user.login.uuid}
                    className={`${styles.result} ${index === activeIndex ? styles.active : ""}`}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelect(user);
                    }}
                  >
                    {variant === "rich" && (
                      <img
                        src={user.picture.medium}
                        alt=''
                        className={styles.avatar}
                      />
                    )}

                    <span className={styles.resultContent}>
                      <span className={styles.resultName}>
                        <span>{user.name.first}</span> <span className={styles.lastName}>{user.name.last.toUpperCase()}</span>
                      </span>

                      {variant === "rich" && (
                        <span className={styles.resultDetails}>
                          <span className={styles.detailItem}>
                            <CalendarDays size={13} />
                            {getBirthday(user)}
                          </span>

                          <span className={styles.detailSeparator}>·</span>

                          <span>{user.dob.age}</span>

                          <span className={styles.detailSeparator}>·</span>

                          <span className={styles.detailItem}>
                            <MapPin size={13} />
                            {getLocation(user)}
                          </span>
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Field>
  );
}
