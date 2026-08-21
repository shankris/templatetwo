"use client";

import { useEffect, useState } from "react";

import { localeCodes } from "@/i18n/languages";

import styles from "./AppBootstrap.module.css";

const THEME_KEY = "theme";
const LOCALE_KEY = "locale";
const DEFAULT_LOCALE = "en";

function getBrowserLocale() {
  const browserLocales = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const browserLocale of browserLocales) {
    const language = browserLocale?.split("-")[0]?.toLowerCase();

    if (localeCodes.includes(language)) {
      return language;
    }
  }

  return DEFAULT_LOCALE;
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function AppBootstrap({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /*
     * --------------------------------------------------
     * THEME
     * --------------------------------------------------
     */

    const theme = getInitialTheme();

    document.documentElement.dataset.theme = theme;

    /*
     * --------------------------------------------------
     * LANGUAGE
     * --------------------------------------------------
     *
     * The URL is ultimately responsible for the locale.
     *
     * Here we only establish the user's preferred locale
     * for the first visit.
     */

    const savedLocale = localStorage.getItem(LOCALE_KEY);

    const locale = savedLocale && localeCodes.includes(savedLocale) ? savedLocale : getBrowserLocale();

    localStorage.setItem(LOCALE_KEY, locale);

    /*
     * --------------------------------------------------
     * APPLICATION READY
     * --------------------------------------------------
     */

    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return children;
}
