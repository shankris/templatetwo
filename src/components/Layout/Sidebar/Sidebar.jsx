"use client";

import SidebarItem from "./SidebarItem";
import styles from "./Sidebar.module.css";

export default function Sidebar({ items = [], enabled = true }) {
  if (!enabled) {
    return null;
  }

  return (
    <aside className={styles.sidebar}>
      <nav
        className={styles.navigation}
        aria-label='Component navigation'
      >
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            level={0}
          />
        ))}
      </nav>
    </aside>
  );
}
