"use client";

import dynamic from "next/dynamic";

import GraphCard from "../GraphCard/GraphCard";
import radialData from "./data.json";
import styles from "./Radial.module.css";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* --------------------------------------------------
   Radial Graph

   Displays the percentage of the portfolio allocated
   to stocks versus cash.

   Props:
   - period      : Selected dashboard period
   - accentColor : Chart accent color

   Defaults:
   - period      : 1m
   - accentColor : var(--primary)
-------------------------------------------------- */

export default function Radial({ period = "1m", accentColor = "var(--primary)" }) {
  /* --------------------------------------------------
     Get Data For Selected Period
  -------------------------------------------------- */

  const currentData = radialData?.data?.[period];

  if (!currentData) {
    return (
      <GraphCard
        title={radialData?.card?.title}
        subtitle={radialData?.card?.subtitle}
      >
        <div className={styles.noData}>Data not available</div>
      </GraphCard>
    );
  }

  /* --------------------------------------------------
     Calculate Allocation
  -------------------------------------------------- */

  const percentage = currentData.total > 0 ? (currentData.invested / currentData.total) * 100 : 0;

  /* --------------------------------------------------
     ApexCharts Configuration
  -------------------------------------------------- */

  const options = {
    chart: {
      type: "radialBar",
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
        startAngle: 0,
        endAngle: 360,

        hollow: {
          margin: 0,
          size: "68%",
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

    labels: ["Invested"],

    stroke: {
      lineCap: "round",
    },

    tooltip: {
      enabled: false,
    },
  };

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */

  return (
    <GraphCard
      title={radialData?.card?.title}
      subtitle={radialData?.card?.subtitle}
    >
      <div className={styles.wrapper}>
        <div className={styles.chart}>
          <Chart
            options={options}
            series={[percentage]}
            type='radialBar'
            width='100%'
            height='100%'
          />
        </div>
      </div>
    </GraphCard>
  );
}
