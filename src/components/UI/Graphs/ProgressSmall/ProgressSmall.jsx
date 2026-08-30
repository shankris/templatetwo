"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import data from "./data.json";

import styles from "./ProgressSmall.module.css";

/* --------------------------------------------------
   Progress Small

   Compact Tabler-inspired metric card.

   Displays:
   - Card title
   - Current value
   - Period variation
   - Compact progress bar

   Props:
   - period      : Selected dashboard period
   - accentColor : Progress bar accent colour

   Defaults:
   - period      : 1d
   - accentColor : var(--primary)
-------------------------------------------------- */

export default function ProgressSmall({ period = "1d", accentColor = "var(--primary)" }) {
  /* --------------------------------------------------
     Get Data For Selected Period
  -------------------------------------------------- */

  const currentData = data?.data?.[period];

  /* --------------------------------------------------
     Handle Missing Period Data
  -------------------------------------------------- */

  if (!currentData) {
    return (
      <article className={styles.card}>
        <div className={styles.noData}>Data not available</div>
      </article>
    );
  }

  /* --------------------------------------------------
     Variation
  -------------------------------------------------- */

  const isPositive = currentData.variation >= 0;

  const variationClass = isPositive ? styles.variationPositive : styles.variationNegative;

  const VariationIcon = isPositive ? TrendingUp : TrendingDown;

  /* --------------------------------------------------
     Progress Percentage

     Keep the value between 0 and 100.
  -------------------------------------------------- */

  const percentage = Math.min(100, Math.max(0, currentData.percentage));

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */

  return (
    <article className={styles.card}>
      {/* --------------------------------------------------
         Card Title
      -------------------------------------------------- */}

      <div className={styles.title}>{data?.card?.title}</div>

      {/* --------------------------------------------------
         Metric
      -------------------------------------------------- */}

      <div className={styles.metric}>
        <div className={styles.value}>₹{currentData.value.toLocaleString("en-IN")}</div>

        <div className={`${styles.variation} ${variationClass}`}>
          <span>{Math.abs(currentData.variation)}%</span>

          <VariationIcon
            size={17}
            strokeWidth={2}
            aria-hidden='true'
          />
        </div>
      </div>

      {/* --------------------------------------------------
         Progress Bar
      -------------------------------------------------- */}

      <div
        className={styles.progress}
        role='progressbar'
        aria-valuenow={percentage}
        aria-valuemin='0'
        aria-valuemax='100'
        aria-label={`${percentage}%`}
      >
        <div
          className={styles.progressBar}
          style={{
            width: `${percentage}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>
    </article>
  );
}
