"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import styles from "./Timeline.module.css";
import data from "./data.json";

const UPDATE_INTERVAL = 60 * 1000;

function getRelativeTime(dateTime) {
  const now = Date.now();
  const time = new Date(dateTime).getTime();

  const difference = now - time;

  // Future event
  if (difference < 0) {
    return "Upcoming";
  }

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return `${Math.max(1, weeks)}w ago`;
}

function formatLocalDateTime(dateTime, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateTime));
}

function formatLocalDate(dateTime, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(new Date(dateTime));
}

export default function Timeline() {
  const [, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  function formatLocalDate(dateTime) {
    return new Date(dateTime).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className={styles.timeline}>
      {data.map((item, index) => {
        const isLast = index === data.length - 1;

        return (
          <div
            key={item.id}
            className={styles.item}
          >
            <div className={styles.markerColumn}>
              <div className={`${styles.marker} ${item.status === "Complete" ? styles.complete : styles.pending}`}>
                {item.status === "Complete" && (
                  <Check
                    size={14}
                    strokeWidth={2.5}
                  />
                )}
              </div>

              {!isLast && <div className={styles.connector} />}
            </div>

            <div className={styles.content}>
              <div className={styles.titleRow}>
                <h3 className={styles.name}>{item.name}</h3>

                {item.status === "Complete" && <span className={styles.relativeTime}>{getRelativeTime(item.dateTime)}</span>}
              </div>

              <p className={styles.description}>{item.description}</p>

              {item.status === "Complete" ? (
                <time
                  className={styles.dateTime}
                  dateTime={item.dateTime}
                  title={formatLocalDateTime(item.dateTime)}
                >
                  {formatLocalDateTime(item.dateTime)}
                </time>
              ) : (
                <span className={styles.dateTime}>ETA {formatLocalDate(item.dateTime)}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
