"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import styles from "./ImageAccordion.module.css";
import data from "./data.json";

/* --------------------------------------------------
   Image Accordion Component
-------------------------------------------------- */

export default function ImageAccordion() {
  const t = useTranslations("Home");

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={styles.section}>
      {/* --------------------------------------------------
         Section Title
      -------------------------------------------------- */}

      <div className={styles.sectionTitle}>
        <span>{t("imageAccordionTitle")}</span>
      </div>

      {/* --------------------------------------------------
         Image Accordion
      -------------------------------------------------- */}

      <div className={styles.wrapper}>
        {data.map((item, index) => (
          <article
            key={item.id}
            className={`${styles.item} ${activeIndex === index ? styles.active : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {/* --------------------------------------------------
               Image
            -------------------------------------------------- */}

            <div className={styles.imageWrapper}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes='(max-width: 768px) 100vw, 20vw'
                className={styles.image}
              />
            </div>

            {/* --------------------------------------------------
               Content
            -------------------------------------------------- */}

            <div className={styles.content}>
              <h2 className={styles.title}>{item.name}</h2>

              <p className={styles.text}>{t(`imageAccordion.${item.description}`)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
