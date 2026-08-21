"use client";

import { X, Globe2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import styles from "./LanguageModal.module.css";

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 10,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

const backdropVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },

  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

const sections = [
  {
    id: "europe",
    name: "Europe",
    flag: "globe",
  },
  {
    id: "asia",
    name: "Asia",
    icon: "globe",
  },
  {
    id: "india",
    name: "India",
    flag: "/flags/in.svg",
  },
];

export default function LanguageModal({ open, languages, currentLocale, onSelect, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          variants={backdropVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            role='dialog'
            aria-modal='true'
            aria-labelledby='language-modal-title'
          >
            <div className={styles.header}>
              <div>
                <h2 id='language-modal-title'>More languages</h2>

                <p>Select your preferred language.</p>
              </div>

              <button
                type='button'
                className={styles.close}
                onClick={onClose}
                aria-label='Close language selector'
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.content}>
              {sections.map((section) => {
                const sectionLanguages = languages.filter((language) => language.region === section.id);

                if (!sectionLanguages.length) {
                  return null;
                }

                return (
                  <section
                    key={section.id}
                    className={styles.section}
                  >
                    <div className={styles.sectionTitle}>
                      {section.flag ? (
                        <img
                          src={section.flag}
                          alt=''
                          className={styles.sectionFlag}
                        />
                      ) : (
                        <Globe2
                          size={20}
                          strokeWidth={1.7}
                          aria-hidden='true'
                        />
                      )}

                      <span>{section.name}</span>
                    </div>

                    <div className={styles.languages}>
                      {sectionLanguages.map((language) => {
                        const isCurrent = language.code === currentLocale;

                        return (
                          <button
                            key={language.code}
                            type='button'
                            className={`${styles.language} ${isCurrent ? styles.current : ""}`}
                            onClick={() => onSelect(language.code)}
                          >
                            {language.flag && (
                              <img
                                src={language.flag}
                                alt=''
                                className={styles.flag}
                              />
                            )}

                            <span className={styles.name}>{language.nativeName}</span>

                            <span className={styles.code}>{language.code.toUpperCase()}</span>

                            {isCurrent && <span className={styles.check}>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
