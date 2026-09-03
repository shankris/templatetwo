"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { TrendingDown, TrendingUp } from "lucide-react";

import GraphCard from "../GraphCard/GraphCard";
import data from "./data.json";

import styles from "./Radial2.module.css";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* --------------------------------------------------
   Radial2

   Tabler-inspired radial metric card.

   Props:
   - period      : Optional parent-controlled period
   - accentColor : Chart accent colour
   - arc         : Arc size in degrees

   Period behaviour:
   - period supplied    : Parent controls period
   - period not supplied: Component controls period

   Defaults:
   - internal period : 1m
   - accentColor     : var(--primary)
   - arc             : 300
-------------------------------------------------- */

export default function Radial2({ period, accentColor = "var(--primary)", arc = 300 }) {
  /* --------------------------------------------------
     Internal Period

     Used only when the parent does not provide a
     period prop.
  -------------------------------------------------- */

  const [internalPeriod, setInternalPeriod] = useState("1m");

  /* --------------------------------------------------
     Determine Active Period

     If the parent supplies a period, it takes
     precedence.

     Otherwise Radial2 manages its own period.
  -------------------------------------------------- */

  const isParentControlled = period !== undefined;

  const activePeriod = isParentControlled ? period : internalPeriod;

  /* --------------------------------------------------
     Period Selection

     These controls are displayed in the GraphCard
     header only when Radial2 manages its own period.
  -------------------------------------------------- */

  const periods = ["1d", "1w", "3m", "6m", "1y"];

  const periodSelector = !isParentControlled && (
    <div className={styles.periods}>
      {periods.map((item) => (
        <button
          key={item}
          type='button'
          className={`${styles.period} ${activePeriod === item ? styles.periodActive : ""}`}
          onClick={() => setInternalPeriod(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );

  /* --------------------------------------------------
     Get Data For Selected Period
  -------------------------------------------------- */

  const currentData = data?.data?.[activePeriod];

  /* --------------------------------------------------
     Handle Missing Period Data
  -------------------------------------------------- */

  if (!currentData) {
    return (
      <GraphCard
        title={data?.card?.title}
        action={periodSelector}
      >
        <div className={styles.noData}>Data not available</div>
      </GraphCard>
    );
  }

  /* --------------------------------------------------
     Variation

     Positive = TrendingUp
     Negative = TrendingDown
  -------------------------------------------------- */

  const isPositive = currentData.variation >= 0;

  const variationClass = isPositive ? styles.variationPositive : styles.variationNegative;

  const VariationIcon = isPositive ? TrendingUp : TrendingDown;

  /* --------------------------------------------------
     Calculate Arc Angles

     360° = complete circle
     300° = small gap
     180° = half circle

     The gap is centred at the bottom.
  -------------------------------------------------- */

  const normalizedArc = Math.min(Math.max(arc, 1), 360);

  const gap = 360 - normalizedArc;

  const startAngle = -90 + gap / 2;
  const endAngle = 270 - gap / 2;

  /* --------------------------------------------------
     ApexCharts Configuration
  -------------------------------------------------- */

  const options = {
    chart: {
      type: "radialBar",
      height: "100%",
      fontFamily: "inherit",

      toolbar: {
        show: false,
      },

      animations: {
        enabled: true,
      },
    },

    colors: [accentColor],

    plotOptions: {
      radialBar: {
        startAngle,
        endAngle,

        hollow: {
          margin: 0,
          size: "72%",
        },

        track: {
          background: "var(--border-subtle)",
          strokeWidth: "100%",
          margin: 0,
        },

        dataLabels: {
          show: true,

          name: {
            show: false,
          },

          value: {
            show: true,

            offsetY: 8,

            fontSize: "28px",
            fontWeight: 600,

            color: "var(--text-primary)",

            formatter: (value) => `${Math.round(value)}%`,
          },
        },
      },
    },

    stroke: {
      lineCap: "round",
    },

    labels: ["Active Users"],

    tooltip: {
      enabled: false,
    },

    dataLabels: {
      enabled: false,
    },
  };

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */

  return (
    <GraphCard
      title={data?.card?.title}
      action={periodSelector}
    >
      <div className={styles.wrapper}>
        {/* --------------------------------------------------
           Main Metric
        -------------------------------------------------- */}

        <div className={styles.metric}>
          <div className={styles.value}>{currentData.value.toLocaleString()}</div>

          <div className={`${styles.variation} ${variationClass}`}>
            <VariationIcon
              size={14}
              strokeWidth={2}
              aria-hidden='true'
            />

            <span>{Math.abs(currentData.variation)}%</span>
          </div>
        </div>

        {/* --------------------------------------------------
           Radial Chart
        -------------------------------------------------- */}

        <div className={styles.chart}>
          <Chart
            options={options}
            series={[currentData.series]}
            type='radialBar'
            width='100%'
            height='100%'
          />
        </div>
      </div>
    </GraphCard>
  );
}
