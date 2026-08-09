// src/components/Layout/Header/Header.jsx

"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useState } from "react";

import navigation from "@/data/navigation.json";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.brand}>Project Template</div>

        <nav className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`}>
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={styles.link}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type='button'
            className={styles.iconButton}
            aria-label='Notifications'
          >
            <Bell
              size={20}
              strokeWidth={1.8}
            />
          </button>

          <ThemeToggle />

          <button
            type='button'
            className={`${styles.menuButton} ${menuOpen ? styles.menuOpen : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg
              viewBox='0 0 100 100'
              className={styles.menuIcon}
              aria-hidden='true'
            >
              <path
                className={styles.menuLine}
                d='M 20,30 H 80'
              />

              <path
                className={styles.menuLine}
                d='M 20,50 H 80'
              />

              <path
                className={styles.menuLine}
                d='M 20,70 H 80'
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
