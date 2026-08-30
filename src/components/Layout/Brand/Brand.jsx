"use client";

import styles from "./Brand.module.css";

/* --------------------------------------------------
   Brand

   Reusable application branding component.

   Props:
   - className : Optional additional CSS class
-------------------------------------------------- */

export default function Brand({ className = "" }) {
  return (
    <div className={`${styles.brand} ${className}`}>
      Rapid<span>Prototypes</span>
    </div>
  );
}
