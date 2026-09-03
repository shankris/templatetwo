"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Field.module.css";

/* --------------------------------------------------
   Field Component
-------------------------------------------------- */

export default function Field({ id, label, required = false, helperText, helpText, variant = "vertical", width = "100%", children }) {
  const [showHelp, setShowHelp] = useState(false);
  const helpContainerRef = useRef(null);

  /* --------------------------------------------------
     Close Help Popup
     When clicking outside the help container
  -------------------------------------------------- */

  useEffect(() => {
    if (!showHelp) return;

    const handleOutsideClick = (event) => {
      if (helpContainerRef.current && !helpContainerRef.current.contains(event.target)) {
        setShowHelp(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showHelp]);

  /* --------------------------------------------------
     Close Help Popup
     When pressing Escape
  -------------------------------------------------- */

  useEffect(() => {
    if (!showHelp) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowHelp(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showHelp]);

  return (
    <div
      className={`${styles.field} ${styles[variant]}`}
      style={{ "--field-width": width }}
    >
      {/* --------------------------------------------------
          Standard Label
      -------------------------------------------------- */}

      {variant !== "floating" && (
        <label
          htmlFor={id}
          className={styles.label}
        >
          {label}

          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* --------------------------------------------------
          Control Row
      -------------------------------------------------- */}

      <div className={styles.controlRow}>
        <div className={styles.control}>
          {children}

          {/* --------------------------------------------------
              Floating Label
          -------------------------------------------------- */}

          {variant === "floating" && (
            <label
              htmlFor={id}
              className={styles.floatingLabel}
            >
              {label}

              {required && <span className={styles.required}>*</span>}
            </label>
          )}
        </div>

        {/* --------------------------------------------------
            Help Button
        -------------------------------------------------- */}

        {helpText && (
          <div
            ref={helpContainerRef}
            className={styles.helpContainer}
          >
            <button
              type='button'
              className={styles.helpButton}
              aria-label={showHelp ? `Close help for ${label}` : `Help for ${label}`}
              aria-expanded={showHelp}
              aria-controls={`${id}-help`}
              onClick={() => setShowHelp((current) => !current)}
            >
              {showHelp ? "×" : "?"}
            </button>

            {showHelp && (
              <div
                id={`${id}-help`}
                className={styles.helpPopover}
                role='status'
              >
                {helpText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --------------------------------------------------
          Helper Text
      -------------------------------------------------- */}

      {helperText && <div className={styles.helperText}>{helperText}</div>}
    </div>
  );
}
