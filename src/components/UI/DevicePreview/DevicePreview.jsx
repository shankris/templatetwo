"use client";

import { useEffect, useState } from "react";

import { Monitor, Tablet, Smartphone } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from "./DevicePreview.module.css";

const DEVICES = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

export default function DevicePreview({ src = "/", initialDevice = "desktop" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [browserWidth, setBrowserWidth] = useState(null);

  const [device, setDevice] = useState(initialDevice);

  useEffect(() => {
    const handleResize = () => {
      setBrowserWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /*
   * Hide the entire preview on a real mobile browser.
   */
  if (browserWidth === null || browserWidth < 768) {
    return null;
  }

  const changeDevice = (newDevice) => {
    setDevice(newDevice);

    const params = new URLSearchParams(searchParams.toString());

    params.set("device", newDevice);

    router.push(`${pathname}?${params.toString()}`);
  };

  const width = DEVICES[device];

  return (
    <div className={styles.previewArea}>
      <div
        className={styles.preview}
        style={{ width: `${width}px` }}
      >
        <iframe
          src={src}
          className={styles.iframe}
          title='Application preview'
        />
      </div>

      <div className={styles.switcher}>
        {browserWidth >= 1280 && (
          <button
            type='button'
            className={`${styles.button} ${device === "desktop" ? styles.active : ""}`}
            onClick={() => changeDevice("desktop")}
            title='Desktop — 1280px'
            aria-label='Desktop preview'
          >
            <Monitor
              size={24}
              strokeWidth={1.8}
            />
          </button>
        )}

        <button
          type='button'
          className={`${styles.button} ${device === "tablet" ? styles.active : ""}`}
          onClick={() => changeDevice("tablet")}
          title='Tablet — 768px'
          aria-label='Tablet preview'
        >
          <span className={styles.tabletIcon}>
            <Tablet
              size={24}
              strokeWidth={1.8}
            />
          </span>
        </button>

        <button
          type='button'
          className={`${styles.button} ${device === "mobile" ? styles.active : ""}`}
          onClick={() => changeDevice("mobile")}
          title='Mobile — 375px'
          aria-label='Mobile preview'
        >
          <Smartphone
            size={24}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </div>
  );
}
