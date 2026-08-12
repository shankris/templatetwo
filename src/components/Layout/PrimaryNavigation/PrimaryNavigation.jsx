"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <nav
      className={styles.navigation}
      aria-label='Primary navigation'
    >
      {navigation.map((item) => {
        const Icon = iconMap[item.icon];

        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.id}
            href={item.href}
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

            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
