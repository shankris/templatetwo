"use client";

import { useState } from "react";
import styles from "./Button.module.css";
import data from "./data.json";

/* --------------------------------------------------
   Button
-------------------------------------------------- */

export default function Button({ children, type = "button", variant = "primary", disabled = false, width = "auto", onClick }) {
  const [ripple, setRipple] = useState(null);

  const handleClick = (event) => {
    if (disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();

    setRipple({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      id: Date.now(),
    });

    onClick?.(event);
  };

  /* --------------------------------------------------
     Standalone component preview
  -------------------------------------------------- */

  if (!children) {
    return (
      <div className={styles.preview}>
        {Object.entries(data.variants).map(([variantName, config]) => (
          <Button
            key={variantName}
            variant={variantName}
            width={width}
            type={type}
            disabled={disabled}
            onClick={onClick}
          >
            {config.label}
          </Button>
        ))}
      </div>
    );
  }

  /* --------------------------------------------------
     Button
  -------------------------------------------------- */

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]}`}
      style={{ "--button-width": width }}
      onClick={handleClick}
    >
      {ripple && (
        <span
          key={ripple.id}
          className={styles.ripple}
          style={{
            "--ripple-x": `${ripple.x}px`,
            "--ripple-y": `${ripple.y}px`,
          }}
        />
      )}

      <span className={styles.content}>{children}</span>
    </button>
  );
}
