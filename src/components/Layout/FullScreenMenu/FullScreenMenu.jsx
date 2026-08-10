// src/components/Layout/FullScreenMenu/FullScreenMenu.jsx

"use client";

import Link from "next/link";
import styles from "./FullScreenMenu.module.css";

export default function FullScreenMenu({ isOpen, items = [], sideItems = [], onNavigate }) {
  return (
    <div
      className={`${styles.menu} ${isOpen ? styles.open : ""}`}
      aria-hidden={!isOpen}
    >
      <div className={styles.content}>
        {/* Main menu */}

        {items.length > 0 && (
          <nav
            className={styles.main}
            aria-label='Main navigation'
          >
            <div className={styles.navigation}>
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
            </div>
          </nav>
        )}

        {/* Optional sidebar / application menu */}

        {sideItems.length > 0 && (
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>Application</h2>

            <nav
              className={styles.sideNavigation}
              aria-label='Application navigation'
            >
              {sideItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={styles.sideLink}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={onNavigate}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
}
