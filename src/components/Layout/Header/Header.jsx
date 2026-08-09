// src/components/Layout/Header/Header.jsx

"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useState } from "react";

import navigation from "@/data/navigation.json";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import MenuButton from "../MenuButton/MenuButton";

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
              aria-hidden='true'
            />
          </button>

          <ThemeToggle />

          <MenuButton
            isOpen={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          />
        </div>
      </div>
    </header>
  );
}
