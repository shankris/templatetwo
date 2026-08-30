"use client";

import dynamic from "next/dynamic";
import { TrendingDown, TrendingUp } from "lucide-react";

import GraphCard from "../GraphCard/GraphCard";
import data from "./data.json";

import styles from "./Bar.module.css";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* --------------------------------------------------
   Bar Graph

   Tabler-inspired compact bar chart.

   Props:
   - period      : Selected dashboard period
   - accentColor : Chart accent colour

   Defaults:
   - period      : 1m
   - accentColor : var(--primary)
-------------------------------------------------- */

export default function Bar({ period = "1m", accentColor = "var(--primary)" }) {
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

     These settings are based on Tabler's compact
     sparkline bar implementation.
-------------------------------------------------- */

  const options = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      height: 40,

      sparkline: {
        enabled: true,
      },

      animations: {
        enabled: false,
      },

      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },

    dataLabels: {
      enabled: false,
    },

    fill: {
      opacity: 1,
    },

    colors: [accentColor],

    tooltip: {
      theme: "dark",
    },

    grid: {
      strokeDashArray: 4,
    },

    xaxis: {
      labels: {
        padding: 0,
      },

      tooltip: {
        enabled: false,
      },

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },

      type: "datetime",
    },

    yaxis: {
      labels: {
        padding: 4,
      },
    },

    legend: {
      show: false,
    },
  };

  /* --------------------------------------------------
     Render
-------------------------------------------------- */

  return (
    <GraphCard title={data?.card?.title}>
      <div className={styles.card}>
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
           Bar Chart
        -------------------------------------------------- */}

        <div className={styles.chart}>
          <Chart
            options={options}
            series={[
              {
                name: "Portfolio",
                data: currentData.series,
              },
            ]}
            type='bar'
            width='100%'
            height={70}
          />
        </div>
      </div>
    </GraphCard>
  );
}
