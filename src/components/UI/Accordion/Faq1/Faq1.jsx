"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import faqData from "./data.json";
import styles from "./Faq1.module.css";

export default function Faq1() {
  const t = useTranslations("Components");

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        {/* --------------------------------------------------
           FAQ Heading
        -------------------------------------------------- */}

        <h3 className={styles.heading}>{t("faq1Content.title")}</h3>

        {/* --------------------------------------------------
           FAQ Questions
        -------------------------------------------------- */}

        {faqData.map((item) => (
          <Question
            key={item.id}
            id={item.id}
            title={t(`faq1Content.${item.id}.title`)}
            content={t(`faq1Content.${item.id}.content`)}
            defaultOpen={item.defaultOpen}
          />
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------
   FAQ Question
-------------------------------------------------- */

function Question({ id, title, content, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  const answerId = `faq-answer-${id}`;

  return (
    <motion.div
      animate={open ? "open" : "closed"}
      className={styles.question}
    >
      {/* --------------------------------------------------
         Question Button
      -------------------------------------------------- */}

      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        className={styles.button}
        aria-expanded={open}
        aria-controls={answerId}
      >
        <motion.span
          variants={{
            open: {
              opacity: 0.7,
            },
            closed: {
              opacity: 1,
            },
          }}
          transition={{
            duration: 0.25,
          }}
          className={styles.title}
        >
          {title}
        </motion.span>

        {/* --------------------------------------------------
           Expand / Collapse Icon
        -------------------------------------------------- */}

        <motion.span
          variants={{
            open: {
              rotate: 180,
              color: "var(--color-text-primary)",
            },
            closed: {
              rotate: 0,
              color: "var(--color-text-secondary)",
            },
          }}
          transition={{
            rotate: {
              type: "spring",
              stiffness: 380,
              damping: 22,
            },
          }}
          className={styles.icon}
        >
          <ChevronDown
            size={24}
            strokeWidth={2}
          />
        </motion.span>
      </button>

      {/* --------------------------------------------------
         Answer
      -------------------------------------------------- */}

      <motion.div
        id={answerId}
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          marginBottom: open ? 24 : 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className={styles.answerWrapper}
      >
        <div className={styles.answer}>{content}</div>
      </motion.div>
    </motion.div>
  );
}
