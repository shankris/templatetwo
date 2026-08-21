"use client";

import { useEffect, useState } from "react";
import { Home, Activity, BarChart3, Grid3X3, Info, FileText, Settings } from "lucide-react";

import SidebarItem from "./SidebarItem";
import styles from "./Sidebar.module.css";

const STORAGE_KEY = "templateTwo-sidebar-expanded";

const iconMap = {
  home: Home,
  activity: Activity,
  chart: BarChart3,
  file: FileText,
  settings: Settings,
  grid: Grid3X3,
  info: Info,
};

export default function Sidebar({ items = [], enabled = true, collapsible = true, defaultExpanded = true, defaultExpandedLevel = 0 }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (savedState !== null) {
      setIsExpanded(savedState === "true");
    }

    setIsReady(true);
  }, []);

  if (!enabled || !isReady) {
    return null;
  }

  function toggleSidebar() {
    if (!collapsible) {
      return;
    }

    setIsExpanded((current) => {
      const nextState = !current;

      localStorage.setItem(STORAGE_KEY, String(nextState));

      return nextState;
    });
  }

  function Icon({ name, ...props }) {
    const IconComponent = iconMap[name];

    if (!IconComponent) {
      return null;
    }

    return <IconComponent {...props} />;
  }

  return (
    <aside className={`${styles.sidebar} ${!isExpanded ? styles.collapsed : ""}`}>
      {collapsible && (
        <div className={styles.header}>
          <button
            type='button'
            className={styles.toggle}
            onClick={toggleSidebar}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isExpanded}
          >
            <span className={isExpanded ? styles.toggleIcon : styles.toggleIconCollapsed}>‹</span>
          </button>
        </div>
      )}

      <nav
        className={styles.navigation}
        aria-label='Application navigation'
      >
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            level={0}
            Icon={Icon}
            sidebarState={isExpanded ? "expanded" : "collapsed"}
            defaultExpandedLevel={defaultExpandedLevel}
          />
        ))}
      </nav>
    </aside>
  );
}
