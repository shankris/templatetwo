// src/components/Layout/Topbar/Tobar.jsx

"use client";

import Link from "next/link";
import styles from "./Topbar.module.css";

function TopbarItem({ item }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  return (
    <div className={styles.item}>
      <Link
        href={item.href}
        className={styles.link}
      >
        {item.label}
      </Link>

      {hasChildren && (
        <div className={styles.dropdown}>
          {item.children.map((child) => (
            <TopbarItem
              key={child.id}
              item={child}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Topbar({ items = [], enabled = true }) {
  if (!enabled) {
    return null;
  }

  return (
    <nav className={styles.topbar}>
      <div className={styles.content}>
        {items.map((item) => (
          <TopbarItem
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </nav>
  );
}
