// src/components/Layout/MenuButton/MenuButton.jsx

"use client";

import styles from "./MenuButton.module.css";

export default function MenuButton({ isOpen, onClick }) {
  return (
    <button
      type='button'
      className={`${styles.button} ${isOpen ? styles.active : ""}`}
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <span className={styles.line} />
      <span className={styles.line} />
      <span className={styles.line} />
    </button>
  );
}
