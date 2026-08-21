"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";

import { languages } from "@/i18n/languages";
import { routing } from "@/i18n/routing";

import LanguageModal from "./LanguageModal";
import styles from "./LanguageSwitcher.module.css";

const wrapperVariants = {
  open: {
    scaleY: 1,
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },

  closed: {
    scaleY: 0,
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
  },

  closed: {
    opacity: 0,
    y: -10,
  },
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  const currentLanguage = languages.find((language) => language.code === locale) || languages[0];

  const availableLanguages = languages.filter((language) => language.available);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function switchLanguage(newLocale) {
    if (newLocale === locale) {
      setOpen(false);
      setModalOpen(false);
      return;
    }

    // Remember the user's explicit language choice
    localStorage.setItem("locale", newLocale);

    const pathWithoutLocale = pathname.replace(new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`), "");

    router.push(`/${newLocale}${pathWithoutLocale || ""}`);

    setOpen(false);
    setModalOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className={styles.container}
    >
      {/* Language trigger */}

      <button
        type='button'
        className={styles.trigger}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup='menu'
      >
        <img
          src={currentLanguage.flag}
          alt=''
          className={styles.flag}
        />

        {/* Desktop */}
        <span className={styles.languageName}>{currentLanguage.nativeName}</span>

        {/* Tablet / Mobile */}
        <span className={styles.languageCode}>{currentLanguage.code.toUpperCase()}</span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={styles.chevron}
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      {/* Dropdown */}

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.dropdown}
            initial='closed'
            animate='open'
            exit='closed'
            variants={wrapperVariants}
            style={{ originY: 0 }}
            role='menu'
          >
            {availableLanguages.map((language) => (
              <motion.button
                key={language.code}
                type='button'
                variants={itemVariants}
                className={`${styles.option} ${language.code === locale ? styles.current : ""}`}
                onClick={() => switchLanguage(language.code)}
                role='menuitem'
              >
                <img
                  src={language.flag}
                  alt=''
                  className={styles.optionFlag}
                />

                <span className={styles.optionName}>{language.nativeName}</span>

                <span className={styles.optionCode}>{language.code.toUpperCase()}</span>
              </motion.button>
            ))}

            <div className={styles.divider} />

            <button
              type='button'
              className={styles.moreLanguages}
              onClick={() => {
                setOpen(false);
                setModalOpen(true);
              }}
            >
              <Globe
                size={16}
                strokeWidth={1.8}
                aria-hidden='true'
              />

              <span>More languages…</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <LanguageModal
        open={modalOpen}
        languages={languages}
        currentLocale={locale}
        onSelect={switchLanguage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
