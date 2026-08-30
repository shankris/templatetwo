"use client";

import dynamic from "next/dynamic";
import { TrendingDown, TrendingUp } from "lucide-react";

import GraphCard from "../GraphCard/GraphCard";
import data from "./data.json";

import styles from "./Line.module.css";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* --------------------------------------------------
   Line Graph

   Tabler-inspired compact line chart.

   Props:
   - period      : Selected dashboard period
   - accentColor : Chart accent colour

   Defaults:
   - period      : 1m
   - accentColor : var(--primary)
-------------------------------------------------- */

export default function Line({ period = "1m", accentColor = "var(--primary)" }) {
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
     Variation
  -------------------------------------------------- */

  const isPositive = currentData.variation >= 0;

  const variationClass = isPositive ? styles.variationPositive : styles.variationNegative;

  const VariationIcon = isPositive ? TrendingUp : TrendingDown;

  /* --------------------------------------------------
     ApexCharts Configuration
  -------------------------------------------------- */

  const options = {
    chart: {
      type: "line",
      fontFamily: "inherit",
      height: 70,

      animations: {
        enabled: false,
      },

      toolbar: {
        show: false,
      },

      offsetX: 0,
      offsetY: 0,
    },

    stroke: {
      curve: "straight",
      width: [1, 2],
    },

    colors: ["var(--muted-slate)", accentColor],

    dataLabels: {
      enabled: false,
    },

    markers: {
      size: 0,
    },

    grid: {
      show: true,

      borderColor: "var(--border-subtle)",

      strokeDashArray: 3,

      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },

    xaxis: {
      labels: {
        show: false,
      },

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },

      tooltip: {
        enabled: true,
        theme: "dark",

        shared: true,
        intersect: false,

        x: {
          show: false,
        },

        y: {
          formatter: (value) => `₹${Math.round(value).toLocaleString("en-IN")}`,
        },

        marker: {
          show: true,
        },

        style: {
          fontSize: "12px",
          fontFamily: "inherit",
        },
      },

      tickPlacement: "on",
    },

    yaxis: {
      show: false,
    },

    legend: {
      show: false,
    },

    tooltip: {
      theme: "dark",

      x: {
        show: false,
      },

      y: {
        formatter: (value) => `₹${Math.round(value).toLocaleString("en-IN")}`,
      },
    },
  };

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
          <div className={styles.value}>₹{currentData.value.toLocaleString("en-IN")}</div>

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
         Line Chart
      -------------------------------------------------- */}

        <div className={styles.chart}>
          <Chart
            options={options}
            series={[
              {
                name: "Previous",
                data: currentData.previousSeries || [],
              },
              {
                name: "Current",
                data: currentData.series,
              },
            ]}
            type='line'
            width='100%'
            height={70}
          />
        </div>
      </div>
    </GraphCard>
  );
}
