"use client";

import { useState } from "react";
import { Home, Activity, BarChart3, FileText, Settings } from "lucide-react";

import SidebarItem from "./SidebarItem";
import styles from "./Sidebar.module.css";

const iconMap = {
  home: Home,
  activity: Activity,
  chart: BarChart3,
  file: FileText,
  settings: Settings,
};

export default function Sidebar({ items = [], enabled = true, collapsible = true, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!enabled) {
    return null;
  }

  function toggleSidebar() {
    if (!collapsible) {
      return;
    }

    setIsExpanded((current) => !current);
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
          />
        ))}
      </nav>
    </aside>
  );
}
