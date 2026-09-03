"use client";

import { useEffect, useMemo, useRef } from "react";

import data from "./data.json";

import styles from "./WorldMap.module.css";

/* --------------------------------------------------
   World Map

   Tabler-inspired interactive world traffic map.

   Displays website traffic by country using an
   interactive SVG vector map.

   Features:
   - Traffic-based country colouring
   - Country tooltips
   - Top countries list

   Props:
   - accentColor : Map highlight colour

   Defaults:
   - accentColor : var(--primary)
-------------------------------------------------- */

export default function WorldMap({ accentColor = "var(--primary)" }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  /* --------------------------------------------------
     Prepare Country Data

     Sort countries by visitor count so the countries
     with the highest traffic appear first.
  -------------------------------------------------- */

  const topCountries = useMemo(() => {
    return Object.entries(data.data)
      .map(([code, country]) => ({
        code,
        ...country,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);
  }, []);

  /* --------------------------------------------------
     Calculate Total Traffic
  -------------------------------------------------- */

  const totalVisitors = useMemo(() => {
    return Object.values(data.data).reduce((total, country) => total + country.visitors, 0);
  }, []);

  /* --------------------------------------------------
     Create Map
  -------------------------------------------------- */

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    /* --------------------------------------------------
       Load jsvectormap Client-Side

       jsvectormap accesses the browser's window object
       during module evaluation, so it must only be
       imported after the component has mounted.
    -------------------------------------------------- */

    const initializeMap = async () => {
      const jsVectorMap = (await import("jsvectormap")).default;

      await import("jsvectormap/dist/maps/world.js");

      /* --------------------------------------------------
         Prevent Duplicate Map Instances
      -------------------------------------------------- */

      mapRef.current.innerHTML = "";

      /* --------------------------------------------------
         Build Visitor Data
      -------------------------------------------------- */

      const visitorData = Object.fromEntries(Object.entries(data.data).map(([code, item]) => [code, item.visitors]));

      /* --------------------------------------------------
         Create Map
      -------------------------------------------------- */

      mapInstance.current = new jsVectorMap({
        selector: mapRef.current,

        map: "world",

        backgroundColor: "transparent",

        zoomButtons: false,
        zoomOnScroll: false,

        zoomAnimate: true,

        regionsSelectable: false,

        /* --------------------------------------------------
           Region Styling
        -------------------------------------------------- */

        regionStyle: {
          initial: {
            fill: "var(--map-region)",
            stroke: "var(--map-border)",
            strokeWidth: 0.5,
          },

          hover: {
            fillOpacity: 0.8,
            cursor: "pointer",
          },

          selected: {
            fill: accentColor,
          },
        },

        /* --------------------------------------------------
           Traffic Volume

           Lowest traffic = lightest blue
           Highest traffic = darkest blue
        -------------------------------------------------- */

        visualizeData: {
          values: visitorData,

          scale: ["#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e3a8a"],

          normalizeFunction: "polynomial",
        },

        /* --------------------------------------------------
           Country Tooltip
        -------------------------------------------------- */

        onRegionTipShow(event, tooltip, code) {
          const country = data.data[code];

          if (!country) {
            return;
          }

          const percentage = (country.visitors / totalVisitors) * 100;

          tooltip.text(`${country.country}: ${country.visitors.toLocaleString()} visitors (${percentage.toFixed(1)}%)`);
        },

        /* --------------------------------------------------
           Country Selection
        -------------------------------------------------- */

        onRegionClick(event, code) {
          if (code === "IN") {
            console.log("India selected");
          }
        },
      });
    };

    initializeMap();

    /* --------------------------------------------------
       Cleanup
    -------------------------------------------------- */

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [accentColor, totalVisitors]);

  /* --------------------------------------------------
     Format Visitor Count

     Keeps large visitor numbers compact.
  -------------------------------------------------- */

  const formatVisitors = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }

    return value.toLocaleString();
  };

  /* --------------------------------------------------
   Focus Map On Country

   Clicking a country in the traffic list focuses
   the existing world map on that country.
-------------------------------------------------- */

  const handleCountryClick = (code) => {
    if (!mapInstance.current) {
      return;
    }

    mapInstance.current.setFocus({
      region: code,
      animate: true,
    });
  };

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */

  return (
    <article className={styles.card}>
      {/* --------------------------------------------------
       Map + Country Traffic
    -------------------------------------------------- */}

      <div className={styles.content}>
        {/* --------------------------------------------------
         Map Section

         Contains the Web Traffic title and the map.
      -------------------------------------------------- */}

        <section className={styles.mapSection}>
          {/* --------------------------------------------------
           Map Header
        -------------------------------------------------- */}

          <header className={styles.header}>
            <h3 className={styles.title}>{data?.card?.title}</h3>
          </header>

          {/* --------------------------------------------------
           Map
        -------------------------------------------------- */}

          <div
            ref={mapRef}
            className={styles.map}
          />
        </section>

        {/* --------------------------------------------------
         Top Countries
      -------------------------------------------------- */}

        <aside className={styles.countries}>
          <div className={styles.countryList}>
            {topCountries.map((country) => {
              const percentage = (country.visitors / totalVisitors) * 100;

              return (
                <div
                  key={country.code}
                  className={styles.country}
                  onClick={() => handleCountryClick(country.code)}
                >
                  {/* --------------------------------------------------
                   Country Flag
                -------------------------------------------------- */}

                  <img
                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                    alt=''
                    className={styles.flag}
                  />

                  {/* --------------------------------------------------
                   Country Information
                -------------------------------------------------- */}

                  <div className={styles.countryInfo}>
                    <span className={styles.countryName}>{country.country}</span>

                    <span className={styles.countryPercentage}>{percentage.toFixed(1)}%</span>
                  </div>

                  {/* --------------------------------------------------
                   Visitor Count
                -------------------------------------------------- */}

                  <span className={styles.visitors}>{formatVisitors(country.visitors)}</span>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </article>
  );
}
