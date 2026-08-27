"use client";

import "@daypicker/react/style.css";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "@daypicker/react";

import styles from "./DatePicker.module.css";

function parseISODate(value) {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
}

function formatISODate(date) {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date, locale) {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale || "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function startOfDay(date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function formatDisplayDateWithDay(date, locale) {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale || "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getRelativeDate(date) {
  if (!date) return "";

  const today = startOfDay(new Date());
  const target = startOfDay(date);

  const difference = Math.round((target - today) / (1000 * 60 * 60 * 24));

  /*
   * --------------------------------------------------
   * Immediate dates
   * --------------------------------------------------
   */

  if (difference === 0) return "Today";
  if (difference === 1) return "Tomorrow";
  if (difference === -1) return "Yesterday";

  /*
   * --------------------------------------------------
   * Days
   *
   * Use elapsed days so we don't have to decide
   * whether Sunday or Monday starts the week.
   * --------------------------------------------------
   */

  if (difference >= 2 && difference <= 7) {
    return `In ${difference} days`;
  }

  if (difference <= -2 && difference >= -7) {
    return `${Math.abs(difference)} days ago`;
  }

  /*
   * --------------------------------------------------
   * Weeks
   * --------------------------------------------------
   */

  const weeks = Math.floor(Math.abs(difference) / 7);

  if (difference > 7 && difference <= 14) {
    return "Next week";
  }

  if (difference < -7 && difference >= -14) {
    return "Last week";
  }

  if (difference > 14 && difference < 30) {
    return `In ${weeks} weeks`;
  }

  if (difference < -14 && difference > -30) {
    return `${weeks} weeks ago`;
  }

  /*
   * --------------------------------------------------
   * Months
   * --------------------------------------------------
   */

  const months = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());

  if (months === 1) {
    return "Next month";
  }

  if (months === -1) {
    return "Last month";
  }

  if (months > 1 && months < 12) {
    return `In ${months} months`;
  }

  if (months < -1 && months > -12) {
    return `${Math.abs(months)} months ago`;
  }

  /*
   * --------------------------------------------------
   * Years
   * --------------------------------------------------
   */

  const years = target.getFullYear() - today.getFullYear();

  if (years === 1) {
    return "Next year";
  }

  if (years === -1) {
    return "Last year";
  }

  if (years > 1) {
    return `In ${years} years`;
  }

  if (years < -1) {
    return `${Math.abs(years)} years ago`;
  }

  return "";
}

export default function DatePicker({ value, onChange, onBlur, locale, validation = {}, placeholder = "Please select a date", datePicker = {}, width = 380 }) {
  const [open, setOpen] = useState(false);

  const { monthYearDropdown = true, minAge, maxAge } = datePicker;
  /*
   * --------------------------------------------------
   * COMMITTED VALUE
   * --------------------------------------------------
   */

  const selectedDate = useMemo(() => parseISODate(value), [value]);
  const [internalDate, setInternalDate] = useState(selectedDate);
  const committedDate = value !== undefined ? selectedDate : internalDate;

  /*
   * --------------------------------------------------
   * PENDING VALUE
   *
   * This is the date currently selected inside the
   * open calendar. It is only committed when OK is
   * clicked.
   * --------------------------------------------------
   */

  const [pendingDate, setPendingDate] = useState(committedDate);

  /*
   * --------------------------------------------------
   * VISIBLE MONTH
   * --------------------------------------------------
   */

  const [visibleMonth, setVisibleMonth] = useState(selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  /*
   * --------------------------------------------------
   * DATE LIMITS
   * --------------------------------------------------
   */

  const explicitMinDate = useMemo(() => parseISODate(validation.minDate), [validation.minDate]);

  const explicitMaxDate = useMemo(() => parseISODate(validation.maxDate), [validation.maxDate]);

  const { minDate, maxDate } = useMemo(
    () =>
      calculateDateBounds({
        explicitMinDate,
        explicitMaxDate,
        minAge,
        maxAge,
      }),
    [explicitMinDate, explicitMaxDate, minAge, maxAge],
  );

  /*
   * Keep pending selection in sync when the external
   * value changes.
   */

  useEffect(() => {
    if (value !== undefined) {
      setInternalDate(selectedDate);
      setPendingDate(selectedDate);
    }
  }, [value, selectedDate]);

  function formatSelectedDay(date, locale) {
    if (!date) return "";

    return new Intl.DateTimeFormat(locale || "en-US", {
      weekday: "long",
    }).format(date);
  }

  /*
   * --------------------------------------------------
   * EFFECTIVE DATE BOUNDS
   *
   * Combines explicit date limits with age-based
   * restrictions to determine the final selectable
   * date range.
   *
   * When multiple restrictions are provided, the most
   * restrictive boundary is used.
   * --------------------------------------------------
   */

  function calculateDateBounds({ explicitMinDate, explicitMaxDate, minAge, maxAge }) {
    const today = startOfDay(new Date());

    let effectiveMinDate = explicitMinDate;
    let effectiveMaxDate = explicitMaxDate;

    /*
     * Maximum age
     *
     * Example:
     * maxAge: 120
     *
     * DOB cannot be earlier than today - 120 years.
     */
    if (maxAge !== undefined && maxAge !== null) {
      const ageMinDate = subtractYears(today, Number(maxAge));

      if (!effectiveMinDate || ageMinDate > effectiveMinDate) {
        effectiveMinDate = ageMinDate;
      }
    }

    /*
     * Minimum age
     *
     * Example:
     * minAge: 18
     *
     * DOB cannot be later than today - 18 years.
     */
    if (minAge !== undefined && minAge !== null) {
      const ageMaxDate = subtractYears(today, Number(minAge));

      if (!effectiveMaxDate || ageMaxDate < effectiveMaxDate) {
        effectiveMaxDate = ageMaxDate;
      }
    }

    return {
      minDate: effectiveMinDate,
      maxDate: effectiveMaxDate,
    };
  }

  function subtractYears(date, years) {
    const result = new Date(date);

    result.setFullYear(result.getFullYear() - years);

    return startOfDay(result);
  }

  /*
   * --------------------------------------------------
   * EFFECTIVE DATE BOUNDS
   *
   * Combines explicit date limits with age-based
   * restrictions to determine the final selectable
   * date range.
   *
   * When multiple restrictions are provided, the most
   * restrictive boundary is used.
   * --------------------------------------------------
   */

  function calculateDateBounds({ explicitMinDate, explicitMaxDate, minAge, maxAge }) {
    const today = startOfDay(new Date());

    let effectiveMinDate = explicitMinDate;
    let effectiveMaxDate = explicitMaxDate;

    /*
     * Maximum age
     *
     * Example:
     * maxAge: 120
     *
     * The user cannot select a date of birth
     * earlier than today minus 120 years.
     */
    if (maxAge !== undefined && maxAge !== null) {
      const ageMinDate = subtractYears(today, Number(maxAge));

      if (!effectiveMinDate || ageMinDate > effectiveMinDate) {
        effectiveMinDate = ageMinDate;
      }
    }

    /*
     * Minimum age
     *
     * Example:
     * minAge: 18
     *
     * The user cannot select a date of birth
     * later than today minus 18 years.
     */
    if (minAge !== undefined && minAge !== null) {
      const ageMaxDate = subtractYears(today, Number(minAge));

      if (!effectiveMaxDate || ageMaxDate < effectiveMaxDate) {
        effectiveMaxDate = ageMaxDate;
      }
    }

    return {
      minDate: effectiveMinDate,
      maxDate: effectiveMaxDate,
    };
  }

  function getEffectiveMinDate({ explicitMinDate, explicitMaxDate, minAge, maxAge }) {
    const today = startOfDay(new Date());

    let result = explicitMinDate;

    // Minimum age means the person must be at least X years old.
    // Therefore their DOB cannot be after today minus X years.
    if (minAge !== undefined && minAge !== null) {
      const ageBasedMaxDate = subtractYears(today, Number(minAge));

      if (!result || ageBasedMaxDate > result) {
        result = ageBasedMaxDate;
      }
    }

    return result;
  }

  function getEffectiveMaxDate({ explicitMaxDate, minAge, maxAge }) {
    const today = startOfDay(new Date());

    let result = explicitMaxDate;

    // Maximum age means the DOB cannot be before today minus X years.
    if (maxAge !== undefined && maxAge !== null) {
      const ageBasedMinDate = subtractYears(today, Number(maxAge));

      if (!result || ageBasedMinDate < result) {
        result = ageBasedMinDate;
      }
    }

    // minAge affects the maximum allowed DOB.
    if (minAge !== undefined && minAge !== null) {
      const ageBasedMaxDate = subtractYears(today, Number(minAge));

      if (!result || ageBasedMaxDate < result) {
        result = ageBasedMaxDate;
      }
    }

    return result;
  }

  /*
   * --------------------------------------------------
   * DISPLAY VALUE
   * --------------------------------------------------
   */

  const displayValue = formatDisplayDate(committedDate, locale);
  const selectedDateDisplay = formatDisplayDate(pendingDate, locale);

  /*
   * --------------------------------------------------
   * OPEN
   * --------------------------------------------------
   */

  function handleOpen() {
    setPendingDate(committedDate);

    if (committedDate) {
      setVisibleMonth(new Date(committedDate.getFullYear(), committedDate.getMonth(), 1));
    } else {
      const today = new Date();

      setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    }

    setOpen(true);
  }

  /*
   * --------------------------------------------------
   * DATE SELECTION
   * --------------------------------------------------
   */

  function handleSelect(date) {
    if (!date) return;

    setPendingDate(date);
  }

  /*
   * --------------------------------------------------
   * TODAY
   * --------------------------------------------------
   */

  function handleToday() {
    const today = startOfDay(new Date());

    setPendingDate(today);

    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  /*
   * --------------------------------------------------
   * CANCEL
   * --------------------------------------------------
   */

  function handleCancel() {
    setPendingDate(committedDate);
    setOpen(false);
  }

  /*
   * --------------------------------------------------
   * OK
   * --------------------------------------------------
   */

  function handleConfirm() {
    if (!pendingDate) return;

    const formattedDate = formatISODate(pendingDate);

    // Works when used inside a form
    onChange?.(formattedDate);

    // Works when displayed independently in the component library
    if (value === undefined) {
      setInternalDate(pendingDate);
    }

    setOpen(false);

    onBlur?.();
  }

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div
      className={styles.wrapper}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
      }}
    >
      <button
        type='button'
        className={styles.trigger}
        onClick={open ? handleCancel : handleOpen}
      >
        <span className={displayValue ? "" : styles.placeholder}>{displayValue || placeholder}</span>

        <CalendarDays
          className={styles.calendarIcon}
          size={18}
          strokeWidth={1.8}
        />
      </button>

      {open && (
        <div className={styles.popover}>
          {/* ----------------------------------------
              SELECTED DATE HEADER
          ---------------------------------------- */}

          <div className={styles.selectedDateArea}>
            {pendingDate ? (
              <>
                <div className={styles.selectedDay}>{formatSelectedDay(pendingDate, locale)}</div>

                <div className={styles.selectedDate}>{formatDisplayDate(pendingDate, locale)}</div>

                <div className={styles.relativeDate}>{getRelativeDate(pendingDate)}</div>
              </>
            ) : (
              <div className={styles.noDate}>Please select a date</div>
            )}
          </div>

          {/* ----------------------------------------
              CALENDAR
          ---------------------------------------- */}

          <DayPicker
            mode='single'
            selected={pendingDate}
            onSelect={handleSelect}
            month={visibleMonth}
            onMonthChange={setVisibleMonth}
            locale={locale}
            startMonth={minDate || new Date(new Date().getFullYear() - 100, 0, 1)}
            endMonth={maxDate || new Date(new Date().getFullYear() + 20, 11, 31)}
            captionLayout={monthYearDropdown ? "dropdown" : "label"}
            navLayout='around'
            className={styles.calendar}
            classNames={{
              today: styles.today,
              selected: styles.selected,
              day_button: styles.dayButton,
            }}
            modifiers={{
              weekend: {
                dayOfWeek: [0, 6],
              },
            }}
            disabled={[minDate ? { before: minDate } : undefined, maxDate ? { after: maxDate } : undefined].filter(Boolean)}
          />

          {/* ----------------------------------------
              ACTIONS
          ---------------------------------------- */}

          <div className={styles.actions}>
            <button
              type='button'
              className={styles.todayButton}
              onClick={handleToday}
            >
              Today
            </button>

            <div className={styles.actionButtons}>
              <button
                type='button'
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type='button'
                className={styles.okButton}
                onClick={handleConfirm}
                disabled={!pendingDate}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
