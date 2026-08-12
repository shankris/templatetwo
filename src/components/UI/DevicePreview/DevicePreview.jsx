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

const MIN_WIDTH = 320;
const MAX_WIDTH = 1920;

export default function DevicePreview({ src = "/", initialDevice = "desktop" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [browserWidth, setBrowserWidth] = useState(null);

  const [device, setDevice] = useState(initialDevice);

  const [previewWidth, setPreviewWidth] = useState(DEVICES[initialDevice] || DEVICES.desktop);

  const [isResizing, setIsResizing] = useState(false);

  /*
   * Track the actual browser width.
   */
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
   * Resize the preview while dragging.
   */
  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handleMouseMove = (event) => {
      const viewportWidth = window.innerWidth;

      /*
       * The preview is centered.
       *
       * Calculate the width based on the mouse position
       * relative to the center of the browser.
       */
      const center = viewportWidth / 2;

      const newWidth = Math.round(Math.abs(event.clientX - center) * 2);

      const clampedWidth = Math.min(Math.max(newWidth, MIN_WIDTH), MAX_WIDTH);

      setPreviewWidth(clampedWidth);

      /*
       * If the width no longer matches a preset,
       * remove the active device.
       */
      if (clampedWidth === DEVICES.desktop) {
        setDevice("desktop");
      } else if (clampedWidth === DEVICES.tablet) {
        setDevice("tablet");
      } else if (clampedWidth === DEVICES.mobile) {
        setDevice("mobile");
      } else {
        setDevice(null);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  /*
   * Hide the entire preview on a real mobile browser.
   */
  if (browserWidth === null || browserWidth < 768) {
    return null;
  }

  const changeDevice = (newDevice) => {
    const newWidth = DEVICES[newDevice];

    setDevice(newDevice);
    setPreviewWidth(newWidth);

    const params = new URLSearchParams(searchParams.toString());

    params.set("device", newDevice);

    router.push(`${pathname}?${params.toString()}`);
  };

  const startResize = (event) => {
    event.preventDefault();

    setIsResizing(true);
  };

  return (
    <div className={`${styles.previewArea} ${isResizing ? styles.resizing : ""}`}>
      <div
        className={styles.preview}
        style={{
          width: `${previewWidth}px`,
        }}
      >
        <iframe
          src={src}
          className={styles.iframe}
          title='Application preview'
        />

        <div
          className={styles.resizeHandle}
          onMouseDown={startResize}
          title='Drag to resize'
        >
          <span />
          <span />
          <span />
        </div>
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

        <div className={styles.widthDisplay}>{previewWidth}px</div>
      </div>
    </div>
  );
}
