"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import GraphCard from "../GraphCard/GraphCard";
import data from "./data.json";

import styles from "./Progress.module.css";

/* --------------------------------------------------
   Progress Graph

   Tabler-inspired horizontal progress indicator.

   Props:
   - period      : Selected dashboard period
   - accentColor : Progress accent colour

   Defaults:
   - period      : 1m
   - accentColor : var(--primary)
-------------------------------------------------- */

export default function Progress({ period = "1m", accentColor = "var(--primary)" }) {
  /* --------------------------------------------------
     Get Data For Selected Period
  -------------------------------------------------- */

  const currentData = data?.data?.[period];

  /* --------------------------------------------------
     Handle Missing Period Data

     Do not fall back to another period.
  -------------------------------------------------- */

  if (!currentData) {
    return (
      <GraphCard title={data?.card?.title}>
        <div className={styles.noData}>Data not available</div>
      </GraphCard>
    );
  }

  /* --------------------------------------------------
     Percentage
  -------------------------------------------------- */

  const percentage = Math.min(100, Math.max(0, Number(currentData.value) || 0));

  /* --------------------------------------------------
     Variation
  -------------------------------------------------- */

  const isPositive = currentData.variation >= 0;

  const variationClass = isPositive ? styles.variationPositive : styles.variationNegative;

  const VariationIcon = isPositive ? TrendingUp : TrendingDown;

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */

  return (
    <GraphCard title={data?.card?.title}>
      <div className={styles.content}>
        {/* --------------------------------------------------
           Metric
        -------------------------------------------------- */}

        <div className={styles.metric}>
          <div className={styles.value}>{percentage}%</div>

          <div className={`${styles.variation} ${variationClass}`}>
            <span>{Math.abs(currentData.variation)}%</span>

            <VariationIcon
              size={16}
              strokeWidth={2}
              aria-hidden='true'
            />
          </div>
        </div>

        {/* --------------------------------------------------
           Progress Description
        -------------------------------------------------- */}

        {currentData.description && <div className={styles.description}>{currentData.description}</div>}

        {/* --------------------------------------------------
           Progress Bar
        -------------------------------------------------- */}

        <div
          className={styles.progress}
          role='progressbar'
          aria-valuenow={percentage}
          aria-valuemin='0'
          aria-valuemax='100'
          style={{
            "--progress-accent": accentColor,
            "--progress-value": `${percentage}%`,
          }}
        >
          <div className={styles.fill} />
          <div className={styles.remaining} />
        </div>
      </div>
    </GraphCard>
  );
}
