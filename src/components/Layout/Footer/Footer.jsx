// src/components/Layout/Footer/Footer.jsx
"use client";

import { useTranslations } from "next-intl";
import Brand from "../Brand/Brand";

import styles from "./Footer.module.css";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Brand />
        <span>{t("copyright")}</span>
      </div>
    </footer>
  );
}
