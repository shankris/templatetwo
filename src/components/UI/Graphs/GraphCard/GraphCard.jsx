"use client";

import styles from "./GraphCard.module.css";

/* --------------------------------------------------
   Graph Card

   Generic card container for dashboard graphs.

   The card does not know which graph it contains.
   The parent component controls the content.

   Props:
   - title    : Card heading
   - subtitle : Muted supporting text
   - action   : Optional header action element
   - children : Graph content
-------------------------------------------------- */

export default function GraphCard({ title, subtitle, action, children }) {
  return (
    <article className={styles.card}>
      {/* --------------------------------------------------
         Card Header
      -------------------------------------------------- */}

      {(title || subtitle || action) && (
        <header className={styles.header}>
          {/* --------------------------------------------------
             Card Heading
          -------------------------------------------------- */}

          <div className={styles.heading}>
            {title && <h3 className={styles.title}>{title}</h3>}

            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          {/* --------------------------------------------------
             Card Action

             Used by individual graphs for optional controls
             such as period selectors.
          -------------------------------------------------- */}

          {action && <div className={styles.action}>{action}</div>}
        </header>
      )}

      {/* --------------------------------------------------
         Card Body
      -------------------------------------------------- */}

      <div className={styles.body}>{children}</div>
    </article>
  );
}
