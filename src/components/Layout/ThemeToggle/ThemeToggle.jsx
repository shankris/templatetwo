// src/components/Layout/ThemeToggle/ThemeToggle.jsx

"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const defaultTheme = prefersDark ? "dark" : "light";

    setTheme(defaultTheme);
    document.documentElement.dataset.theme = defaultTheme;
  }, []);

  const toggleTheme = (event) => {
    const newTheme = theme === "dark" ? "light" : "dark";

    /*
     * Find the centre of the theme button.
     * This becomes the origin of the circular reveal.
     */
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    document.documentElement.style.setProperty("--vt-x", `${x}px`);

    document.documentElement.style.setProperty("--vt-y", `${y}px`);

    /*
     * Use the View Transition API when available.
     */
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        document.documentElement.dataset.theme = newTheme;
      });
    } else {
      document.documentElement.dataset.theme = newTheme;
    }

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  const isDark = theme === "dark";

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className={styles.toggleButton}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun
          size={20}
          strokeWidth={1.8}
          aria-hidden='true'
        />
      ) : (
        <Moon
          size={20}
          strokeWidth={1.8}
          aria-hidden='true'
        />
      )}
    </button>
  );
}
