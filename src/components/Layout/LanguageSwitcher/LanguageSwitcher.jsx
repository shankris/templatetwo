"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = locale === "en" ? "fr" : "en";

  function switchLanguage() {
    const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "");

    router.push(`/${otherLocale}${pathWithoutLocale || ""}`);
  }

  return (
    <button
      type='button'
      className={styles.button}
      onClick={switchLanguage}
    >
      {otherLocale.toUpperCase()}
    </button>
  );
}
