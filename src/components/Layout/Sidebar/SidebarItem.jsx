"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./SidebarItem.module.css";

export default function SidebarItem({ item, level = 0, Icon, sidebarState = "expanded", defaultExpandedLevel = 0 }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Sidebar");

  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  const isCollapsed = sidebarState === "collapsed";

  const localizedHref = item.href && item.href !== "#" ? `/${locale}${item.href === "/" ? "" : item.href}` : "#";

  const isActive = item.href && item.href !== "#" && pathname === localizedHref;

  function hasActiveChild(children) {
    if (!Array.isArray(children)) {
      return false;
    }

    return children.some((child) => {
      if (child.href && child.href !== "#" && pathname === `/${locale}${child.href === "/" ? "" : child.href}`) {
        return true;
      }

      return hasActiveChild(child.children);
    });
  }

  const hasActiveDescendant = hasActiveChild(item.children);

  /*
   * The branch containing the current page
   * must always be open.
   */
  const routeRequiresOpen = hasChildren && hasActiveDescendant;

  /*
   * Local state is only used for manual expansion
   * while the user remains in the same route area.
   */
  const [manuallyOpen, setManuallyOpen] = useState(level === 0);

  /*
   * When the route changes:
   *
   * - open if the current route is inside this branch
   * - close if the current route has moved elsewhere
   */

  const isOpen = routeRequiresOpen || manuallyOpen;

  function toggleChildren(event) {
    event.preventDefault();
    event.stopPropagation();

    setManuallyOpen((current) => !current);
  }

  return (
    <div
      className={styles.wrapper}
      data-level={level}
      data-state={sidebarState}
    >
      <div className={`${styles.itemRow} ${level === 0 ? styles.topLevelRow : ""} ${isActive ? styles.activeRow : ""}`}>
        {hasChildren && !isCollapsed && (
          <button
            type='button'
            className={styles.expandButton}
            onClick={toggleChildren}
            aria-label={isOpen ? `${t("collapse")} ${t(item.id)}` : `${t("expand")} ${t(item.id)}`}
            aria-expanded={isOpen}
          >
            <ChevronRight
              size={16}
              strokeWidth={1.8}
              className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
              aria-hidden='true'
            />
          </button>
        )}

        {!hasChildren && !isCollapsed && <span className={styles.expandPlaceholder} />}

        <Link
          href={localizedHref}
          className={`${styles.link} ${isActive ? styles.activeLink : ""}`}
          aria-current={isActive ? "page" : undefined}
          title={isCollapsed ? t(item.id) : undefined}
          onClick={() => {
            if (hasChildren) {
              setManuallyOpen((current) => !current);
            }
          }}
        >
          <span className={styles.label}>{t(item.id)}</span>
        </Link>
      </div>

      {hasChildren && !isCollapsed && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              className={styles.children}
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.22,
                ease: "easeOut",
              }}
            >
              {item.children.map((child) => (
                <SidebarItem
                  key={child.id}
                  item={child}
                  level={level + 1}
                  Icon={Icon}
                  sidebarState={sidebarState}
                  defaultExpandedLevel={defaultExpandedLevel}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
