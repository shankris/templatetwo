"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import styles from "./LanguageSwitcher.module.css";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLanguage(event) {
    const newLocale = event.target.value;

    if (newLocale === locale) {
      return;
    }

    const pathWithoutLocale = pathname.replace(/^\/(en|fr|de)/, "");

    router.push(`/${newLocale}${pathWithoutLocale || ""}`);
  }

  return (
    <select
      value={locale}
      onChange={switchLanguage}
      className={styles.select}
      aria-label='Select language'
    >
      {languages.map((language) => (
        <option
          key={language.code}
          value={language.code}
        >
          {language.label}
        </option>
      ))}
    </select>
  );
}
