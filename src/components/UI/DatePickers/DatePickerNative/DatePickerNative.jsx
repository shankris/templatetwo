"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import styles from "./DatePickerNative.module.css";

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatISODate(date) {
  if (!date) return "";

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseISODate(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function startOfDay(date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function addDays(date, days) {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
}

function addMonths(date, months) {
  const result = new Date(date);

  result.setDate(1);
  result.setMonth(result.getMonth() + months);

  return result;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();

  const daysInMonth = getDaysInMonth(year, month);

  const days = [];

  for (let i = 0; i < firstWeekday; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  while (days.length < 42) {
    days.push(null);
  }

  return days;
}

function isSameDay(a, b) {
  if (!a || !b) return false;

  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBefore(a, b) {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isAfter(a, b) {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function getDateLimits(validation = {}) {
  const today = startOfDay(new Date());

  let minDate = null;
  let maxDate = null;

  /*
   * Age based limits
   */

  if (validation.minAge !== undefined) {
    maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() - validation.minAge);
  }

  if (validation.maxAge !== undefined) {
    minDate = new Date(today);
    minDate.setFullYear(today.getFullYear() - validation.maxAge);
  }

  /*
   * Days from today
   */

  if (validation.minDaysFromToday !== undefined) {
    minDate = addDays(today, validation.minDaysFromToday);
  }

  if (validation.maxDaysFromToday !== undefined) {
    maxDate = addDays(today, validation.maxDaysFromToday);
  }

  /*
   * Explicit dates
   */

  if (validation.minDate) {
    minDate = parseISODate(validation.minDate);
  }

  if (validation.maxDate) {
    maxDate = parseISODate(validation.maxDate);
  }

  return {
    minDate,
    maxDate,
  };
}

function getLocale(locale) {
  if (locale) return locale;

  if (typeof navigator !== "undefined") {
    return navigator.language || "en-US";
  }

  return "en-US";
}

function formatMonthYear(date, locale) {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getWeekdays(locale) {
  const baseDate = new Date(2024, 0, 7);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(baseDate);

    date.setDate(baseDate.getDate() + index);

    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
    }).format(date);
  });
}

function formatDisplayDate(date, locale) {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getMonthNames(locale) {
  return Array.from({ length: 12 }, (_, month) => {
    const date = new Date(2024, month, 1);

    return new Intl.DateTimeFormat(locale, {
      month: "long",
    }).format(date);
  });
}

function getYearRange(minDate, maxDate, visibleMonth) {
  const currentYear = new Date().getFullYear();

  let startYear = currentYear - 100;
  let endYear = currentYear + 20;

  if (minDate) {
    startYear = minDate.getFullYear();
  }

  if (maxDate) {
    endYear = maxDate.getFullYear();
  }

  /*
   * Make sure the currently visible year is always available.
   */

  startYear = Math.min(startYear, visibleMonth.getFullYear());
  endYear = Math.max(endYear, visibleMonth.getFullYear());

  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}

export default function DatePickerNative({ value, onChange, onBlur, locale, validation = {}, placeholder = "Select a date", datePicker = {}, width = 380 }) {
  //export default function DatePickerNative({ mode = "single", value, onChange, onBlur, locale, validation = {}, placeholder = "Select a date", months = 1, width = 280 }) {
  // export default function DatePickerNative({ value, onChange, onBlur, locale, validation = {}, placeholder = "Select a date", datePicker = {} }) {
  const wrapperRef = useRef(null);

  /*
   * --------------------------------------------------
   * DATE PICKER CONFIGURATION
   * --------------------------------------------------
   */

  const { range = false, months = 1, monthYearDropdown = false } = datePicker;

  const monthCount = Math.min(Math.max(Number(months) || 1, 1), 3);

  const resolvedLocale = getLocale(locale);

  /*
   * --------------------------------------------------
   * STATE
   * --------------------------------------------------
   */

  const [open, setOpen] = useState(false);

  const initialDate = useMemo(() => {
    if (range) {
      return parseISODate(value?.start) || parseISODate(value?.end) || startOfDay(new Date());
    }

    return parseISODate(value) || startOfDay(new Date());
  }, [value, range]);

  const [visibleMonth, setVisibleMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

  const [rangeStart, setRangeStart] = useState(range ? parseISODate(value?.start) : null);

  const [rangeEnd, setRangeEnd] = useState(range ? parseISODate(value?.end) : null);

  const [selectedDate, setSelectedDate] = useState(!range ? parseISODate(value) : null);

  const { minDate, maxDate } = getDateLimits(validation);

  const weekdays = useMemo(() => getWeekdays(resolvedLocale), [resolvedLocale]);

  const monthNames = useMemo(() => getMonthNames(resolvedLocale), [resolvedLocale]);

  const years = useMemo(() => getYearRange(minDate, maxDate, visibleMonth), [minDate, maxDate, visibleMonth]);

  /*
   * --------------------------------------------------
   * CLOSE WHEN CLICKING OUTSIDE
   * --------------------------------------------------
   */

  useEffect(() => {
    function handleOutsideClick(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /*
   * --------------------------------------------------
   * SYNC WITH VALUE
   * --------------------------------------------------
   */

  useEffect(() => {
    if (!range) {
      setSelectedDate(parseISODate(value));
      return;
    }

    setRangeStart(parseISODate(value?.start));
    setRangeEnd(parseISODate(value?.end));
  }, [value, range]);

  /*
   * --------------------------------------------------
   * DATE LIMITS
   * --------------------------------------------------
   */

  function isDisabled(date) {
    if (!date) return true;

    if (minDate && isBefore(date, minDate)) {
      return true;
    }

    if (maxDate && isAfter(date, maxDate)) {
      return true;
    }

    return false;
  }

  /*
   * --------------------------------------------------
   * DATE SELECTION
   * --------------------------------------------------
   */

  function handleDateClick(date) {
    if (!date || isDisabled(date)) {
      return;
    }

    /*
     * Single date
     */

    if (!range) {
      setSelectedDate(date);

      onChange?.(formatISODate(date));

      setOpen(false);

      onBlur?.();

      return;
    }

    /*
     * Range selection
     */

    if (!rangeStart || rangeEnd) {
      setRangeStart(date);
      setRangeEnd(null);

      onChange?.({
        start: formatISODate(date),
        end: "",
      });

      return;
    }

    /*
     * If second date is before first date,
     * automatically reverse the range.
     */

    if (isBefore(date, rangeStart)) {
      setRangeStart(date);
      setRangeEnd(rangeStart);

      onChange?.({
        start: formatISODate(date),
        end: formatISODate(rangeStart),
      });

      setOpen(false);

      onBlur?.();

      return;
    }

    /*
     * Complete range
     */

    setRangeEnd(date);

    onChange?.({
      start: formatISODate(rangeStart),
      end: formatISODate(date),
    });

    setOpen(false);

    onBlur?.();
  }

  function isInRange(date) {
    if (!range || !rangeStart || !rangeEnd || !date) {
      return false;
    }

    return !isBefore(date, rangeStart) && !isAfter(date, rangeEnd);
  }

  /*
   * --------------------------------------------------
   * MONTH NAVIGATION
   * --------------------------------------------------
   */

  function handlePreviousMonth() {
    setVisibleMonth((current) => addMonths(current, -1));
  }

  function handleNextMonth() {
    setVisibleMonth((current) => addMonths(current, 1));
  }

  function canGoPrevious() {
    if (!minDate) return true;

    const firstMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);

    return firstMonth > new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  }

  function canGoNext() {
    if (!maxDate) return true;

    const lastVisibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + monthCount, 0);

    return lastVisibleMonth < new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
  }

  /*
   * --------------------------------------------------
   * MONTH / YEAR DROPDOWNS
   * --------------------------------------------------
   */

  function handleMonthChange(event) {
    const month = Number(event.target.value);

    setVisibleMonth(new Date(visibleMonth.getFullYear(), month, 1));
  }

  function handleYearChange(event) {
    const year = Number(event.target.value);

    setVisibleMonth(new Date(year, visibleMonth.getMonth(), 1));
  }

  /*
   * --------------------------------------------------
   * DISPLAY VALUE
   * --------------------------------------------------
   */

  let displayValue = "";

  if (!range) {
    displayValue = formatDisplayDate(selectedDate, resolvedLocale);
  } else if (rangeStart && rangeEnd) {
    displayValue = `${formatDisplayDate(rangeStart, resolvedLocale)} → ${formatDisplayDate(rangeEnd, resolvedLocale)}`;
  } else if (rangeStart) {
    displayValue = `${formatDisplayDate(rangeStart, resolvedLocale)} → Select end date`;
  }

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
      }}
    >
      <button
        type='button'
        className={styles.trigger}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={displayValue ? "" : styles.placeholder}>{displayValue || placeholder}</span>

        <span className={styles.calendarIcon}>▣</span>
      </button>

      {open && (
        <div className={styles.popover}>
          <div className={styles.calendarHeader}>
            <button
              type='button'
              onClick={handlePreviousMonth}
              disabled={!canGoPrevious()}
              aria-label='Previous month'
            >
              ‹
            </button>

            {monthYearDropdown ? (
              <div className={styles.selectors}>
                <select
                  value={visibleMonth.getMonth()}
                  onChange={handleMonthChange}
                  className={styles.monthSelect}
                  aria-label='Select month'
                >
                  {monthNames.map((month, index) => (
                    <option
                      key={month}
                      value={index}
                    >
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={visibleMonth.getFullYear()}
                  onChange={handleYearChange}
                  className={styles.yearSelect}
                  aria-label='Select year'
                >
                  {years.map((year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className={styles.monthTitle}>{formatMonthYear(visibleMonth, resolvedLocale)}</div>
            )}

            <button
              type='button'
              onClick={handleNextMonth}
              disabled={!canGoNext()}
              aria-label='Next month'
            >
              ›
            </button>
          </div>

          <div className={`${styles.months} ${monthCount > 1 ? styles.multiMonth : ""}`}>
            {Array.from({ length: monthCount }, (_, monthIndex) => {
              const monthDate = addMonths(visibleMonth, monthIndex);

              const days = getCalendarDays(monthDate);

              return (
                <div
                  className={styles.month}
                  key={`${monthDate.getFullYear()}-${monthDate.getMonth()}`}
                >
                  {monthCount > 1 && <div className={styles.monthName}>{formatMonthYear(monthDate, resolvedLocale)}</div>}

                  <div className={styles.weekdays}>
                    {weekdays.map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>

                  <div className={styles.days}>
                    {days.map((date, index) => {
                      if (!date) {
                        return (
                          <span
                            key={`empty-${index}`}
                            className={styles.empty}
                          />
                        );
                      }

                      const selected = !range ? isSameDay(date, selectedDate) : isSameDay(date, rangeStart) || isSameDay(date, rangeEnd);

                      const today = isSameDay(date, startOfDay(new Date()));

                      const disabled = isDisabled(date);

                      const inRange = isInRange(date);

                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                      return (
                        <button
                          type='button'
                          key={formatISODate(date)}
                          className={[styles.day, selected ? styles.selected : "", today ? styles.today : "", inRange ? styles.inRange : "", disabled ? styles.disabled : "", isWeekend ? styles.weekend : ""].filter(Boolean).join(" ")}
                          disabled={disabled}
                          onClick={() => handleDateClick(date)}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {range && <div className={styles.rangeHint}>{rangeStart && !rangeEnd ? "Select an end date" : "Select a date range"}</div>}
        </div>
      )}
    </div>
  );
}
