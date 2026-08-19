"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

import { Home, LayoutGrid, Info, Mail } from "lucide-react";

import navigation from "@/data/navigation.json";

import styles from "./PrimaryNavigation.module.css";

const iconMap = {
  home: Home,
  grid: LayoutGrid,
  info: Info,
  mail: Mail,
};

export default function PrimaryNavigation() {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const locale = useLocale();

  return (
    <nav
      className={styles.navigation}
      aria-label='Primary navigation'
    >
      {navigation.map((item) => {
        const Icon = iconMap[item.icon];

        const localizedHref = item.href === "/" ? `/${locale}` : `/${locale}${item.href}`;
        const isActive = item.href === "/" ? pathname === localizedHref : pathname.startsWith(localizedHref);

        return (
          <Link
            key={item.id}
            href={`/${locale}${item.href === "/" ? "" : item.href}`}
            className={`${styles.link} ${isActive ? styles.active : ""}`}
          >
            {Icon && (
              <Icon
                className={styles.icon}
                size={18}
                strokeWidth={1.8}
                aria-hidden='true'
              />
            )}

            <span>{t(item.id)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
