"use client";

import dynamic from "next/dynamic";
import { TrendingDown, TrendingUp } from "lucide-react";

import GraphCard from "../GraphCard/GraphCard";
import data from "./data.json";

import styles from "./Area.module.css";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* --------------------------------------------------
   Area Graph

   Tabler-inspired area chart.

   Displays:
   - Title
   - Current value
   - Period variation
   - Area chart
-------------------------------------------------- */

export default function Area({ period = "1m", accentColor = "var(--primary)" }) {
  /* --------------------------------------------------
     Get Data For Selected Period
  -------------------------------------------------- */

  const currentData = data?.data?.[period];

  /* --------------------------------------------------
     Handle Missing Period Data
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
      type: "area",
      fontFamily: "inherit",

      height: 70,

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

    stroke: {
      curve: "straight",
      width: 2,
    },

    colors: [accentColor],

    /* --------------------------------------------------
       Area Fill
    -------------------------------------------------- */

    fill: {
      type: "solid",
      opacity: 0.15,
    },

    dataLabels: {
      enabled: false,
    },

    markers: {
      size: 0,
    },

    grid: {
      show: false,
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
        enabled: false,
      },
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
            <VariationIcon
              size={17}
              strokeWidth={2}
              aria-hidden='true'
            />

            <span>{Math.abs(currentData.variation)}%</span>
          </div>
        </div>

        {/* --------------------------------------------------
           Area Chart
        -------------------------------------------------- */}

        <div className={styles.chart}>
          <Chart
            options={options}
            series={[
              {
                name: "Revenue",
                data: currentData.series,
              },
            ]}
            type='area'
            width='100%'
            height={70}
          />
        </div>
      </div>
    </GraphCard>
  );
}
