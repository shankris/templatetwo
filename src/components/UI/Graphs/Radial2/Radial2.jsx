"use client";

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
   - period      : Selected dashboard period
   - accentColor : Chart accent colour

   Defaults:
   - period      : 1m
   - accentColor : var(--primary)
-------------------------------------------------- */

export default function Radial2({ period = "1m", accentColor = "var(--primary)" }) {
  /* --------------------------------------------------
     Get Data For Selected Period
  -------------------------------------------------- */

  const currentData = data?.data?.[period];

  /* --------------------------------------------------
     Handle Missing Period Data

     We deliberately do not fall back to another period.
     Showing another period could be misleading.
  -------------------------------------------------- */

  if (!currentData) {
    return (
      <GraphCard title={data?.card?.title}>
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
        startAngle: -90,
        endAngle: 270,

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
    <GraphCard title={data?.card?.title}>
      <div className={styles.wrapper}>
        {/* --------------------------------------------------
           Metric
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
