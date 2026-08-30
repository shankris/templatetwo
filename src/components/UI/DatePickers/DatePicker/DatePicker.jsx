"use client";

import "@daypicker/react/style.css";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "@daypicker/react";

import styles from "./DatePicker.module.css";

function parseISODate(value) {
  if (!value) return undefined;

  if (typeof value === "string" && value.startsWith("today")) {
    const offset = value === "today" ? 0 : Number(value.replace("today", ""));

    if (Number.isNaN(offset)) return undefined;

    const today = startOfDay(new Date());

    today.setDate(today.getDate() + offset);

    return startOfDay(today);
  }

  // Support both:
  // 2026-09-01
  // 2026-09-01T10:30
  if (typeof value === "string") {
    const datePart = value.slice(0, 10);
    const [year, month, day] = datePart.split("-").map(Number);

    if (!year || !month || !day) return undefined;

    return new Date(year, month - 1, day);
  }

  return undefined;
}

function formatISODate(date) {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseTime(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const [hours, minutes] = value.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return {
    hours,
    minutes,
  };
}

function formatTime(hours, minutes) {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function getTimeFromValue(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  const match = value.match(/T(\d{2}):(\d{2})/);

  if (!match) {
    return "";
  }

  return `${match[1]}:${match[2]}`;
}

function generateTimeSlots(startTime, endTime, interval) {
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (!start || !end || !interval) {
    return [];
  }

  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;

  if (endMinutes < startMinutes) {
    return [];
  }

  const slots = [];

  for (let minutes = startMinutes; minutes <= endMinutes; minutes += Number(interval)) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    slots.push(formatTime(hours, mins));
  }

  return slots;
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

export default function DatePicker({ value, onChange, onBlur, locale, validation = {}, placeholder = "Please select a date", datePicker = {}, width = 380 }) {
  const [open, setOpen] = useState(false);

  const { monthYearDropdown = true, minAge, maxAge, validation: datePickerValidation = {}, showTime = false, startTime = "09:00", endTime = "17:00", timeInterval = 30, blockedTimes = [] } = datePicker;
  const timeSlots = useMemo(() => generateTimeSlots(startTime, endTime, timeInterval), [startTime, endTime, timeInterval]);

  const effectiveValidation = {
    ...validation,
    ...datePickerValidation,
  };

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
  const [pendingTime, setPendingTime] = useState(getTimeFromValue(value) || timeSlots[0] || "");

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

  const explicitMinDate = useMemo(() => parseISODate(effectiveValidation.minDate), [effectiveValidation.minDate]);
  const explicitMaxDate = useMemo(() => parseISODate(effectiveValidation.maxDate), [effectiveValidation.maxDate]);

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

  const today = startOfDay(new Date());
  const todayInRange = (!minDate || today >= minDate) && (!maxDate || today <= maxDate);

  /*
   * Keep pending selection in sync when the external
   * value changes.
   */

  useEffect(() => {
    if (value !== undefined) {
      setInternalDate(selectedDate);
      setPendingDate(selectedDate);
      setPendingTime(getTimeFromValue(value) || timeSlots[0] || "");
    }
  }, [value, selectedDate, timeSlots]);

  function formatSelectedDay(date, locale) {
    if (!date) return "";

    return new Intl.DateTimeFormat(locale || "en-US", {
      weekday: "long",
    }).format(date);
  }

  /*
   * --------------------------------------------------
   * DISPLAY VALUE
   * --------------------------------------------------
   */

  const displayValue = formatDisplayDate(committedDate, locale);

  function handleClear() {
    // Clear the pending selection immediately.
    setPendingDate(undefined);
    setPendingTime("");

    // Clear the committed value when the component
    // is being used as a controlled form field.
    onChange?.("");

    // Clear the internal value when the component
    // is being displayed independently.
    if (value === undefined) {
      setInternalDate(undefined);
    }

    // Close the calendar after clearing the date.
    setOpen(false);

    onBlur?.();
  }

  /*
   * --------------------------------------------------
   * OPEN
   * --------------------------------------------------
   */

  function handleOpen() {
    // Restore the currently committed date whenever
    // the calendar is reopened.
    setPendingDate(committedDate);

    if (committedDate) {
      /*
       * Open on the month containing the currently
       * selected date.
       */
      setVisibleMonth(new Date(committedDate.getFullYear(), committedDate.getMonth(), 1));
    } else if (minDate) {
      /*
       * When no date has been selected, open on the
       * first month containing a valid selectable date.
       */
      setVisibleMonth(new Date(minDate.getFullYear(), minDate.getMonth(), 1));
    } else {
      /*
       * If there is no selected date or minimum date,
       * open on the current month.
       */
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

    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;

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
    setPendingTime(getTimeFromValue(value) || timeSlots[0] || "");
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

    const formattedValue = showTime && pendingTime ? `${formattedDate}T${pendingTime}` : formattedDate;

    onChange?.(formattedValue);

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

          {showTime && (
            <div className={styles.timeSection}>
              <label
                htmlFor='appointment-time'
                className={styles.timeLabel}
              >
                Time
              </label>

              <select
                id='appointment-time'
                className={styles.timeSelect}
                value={pendingTime}
                onChange={(event) => setPendingTime(event.target.value)}
                disabled={!pendingDate}
              >
                <option value=''>Select time</option>

                {timeSlots.map((time) => {
                  const blocked = blockedTimes.includes(time);

                  return (
                    <option
                      key={time}
                      value={time}
                      disabled={blocked}
                    >
                      {time}
                      {blocked ? " — Unavailable" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* ----------------------------------------
              ACTIONS
          ---------------------------------------- */}

          <div className={styles.actions}>
            {todayInRange && (
              <button
                type='button'
                className={styles.todayButton}
                onClick={handleToday}
              >
                Today
              </button>
            )}
            <button
              type='button'
              className={styles.clearButton}
              onClick={handleClear}
            >
              Clear
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
