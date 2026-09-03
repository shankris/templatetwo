/* --------------------------------------------------
   Format Relative Session Date

   Provides useful relative context such as:

   Today
   Yesterday
   3d ago
   2w ago
   2mo ago
   1y ago
-------------------------------------------------- */

export function formatSessionRelativeDate(startDate) {
  const date = new Date(startDate);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const differenceInDays = Math.floor((startOfToday - startOfDate) / (1000 * 60 * 60 * 24));

  /* ------------------------------------------------
     Recent sessions
  ------------------------------------------------ */

  if (differenceInDays === 0) {
    return "Today";
  }

  if (differenceInDays === 1) {
    return "Yesterday";
  }

  if (differenceInDays < 7) {
    return `${differenceInDays}d ago`;
  }

  /* ------------------------------------------------
     Weeks
  ------------------------------------------------ */

  if (differenceInDays < 30) {
    const weeks = Math.floor(differenceInDays / 7);

    return `${weeks}w ago`;
  }

  /* ------------------------------------------------
     Months
  ------------------------------------------------ */

  const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

  if (months < 12) {
    return `${months}mo ago`;
  }

  /* ------------------------------------------------
     Years
  ------------------------------------------------ */

  const years = Math.floor(months / 12);

  return `${years}y ago`;
}

/* --------------------------------------------------
   Format Session Time

   Displays the session's actual start and end time.

   Same day:
   Aug 25 · 8:10 AM – 4:30 PM

   Different days:
   Aug 25 · 8:10 AM – Aug 26 · 4:30 PM
-------------------------------------------------- */

export function formatSessionTime(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const sameDay = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth() && start.getDate() === end.getDate();

  const dateOptions = {
    month: "short",
    day: "numeric",
  };

  const timeOptions = {
    hour: "numeric",
    minute: "2-digit",
  };

  const startDateText = start.toLocaleDateString(undefined, dateOptions);

  const endDateText = end.toLocaleDateString(undefined, dateOptions);

  const startTimeText = start.toLocaleTimeString(undefined, timeOptions);

  const endTimeText = end.toLocaleTimeString(undefined, timeOptions);

  if (sameDay) {
    return `${startDateText} · ${startTimeText} – ${endTimeText}`;
  }

  return `${startDateText} · ${startTimeText} – ${endDateText} · ${endTimeText}`;
}

/* --------------------------------------------------
   Format Session Duration

   Examples:

   42m
   8h
   8h 20m
-------------------------------------------------- */

export function formatSessionDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const difference = end - start;

  if (difference <= 0) {
    return "0m";
  }

  const totalMinutes = Math.floor(difference / (1000 * 60));

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}
