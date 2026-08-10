// src/components/Layout/FullScreenMenu/FullScreenMenu.jsx

"use client";

import Link from "next/link";
import styles from "./FullScreenMenu.module.css";

export default function FullScreenMenu({ isOpen, items = [], onNavigate }) {
  return (
    <div
      className={`${styles.menu} ${isOpen ? styles.open : ""}`}
      aria-hidden={!isOpen}
    >
      <div className={styles.content}>
        <nav className={styles.navigation}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={styles.link}
              tabIndex={isOpen ? 0 : -1}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
