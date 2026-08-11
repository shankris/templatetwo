"use client";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

import styles from "./WebAppLayout.module.css";

export default function WebAppLayout({ children, navigation = {}, navigationItems = [] }) {
  const navigationType = navigation.type;

  const sidebarConfig = navigation.sidebar || {};
  const topbarConfig = navigation.topbar || {};

  const sidebarEnabled = sidebarConfig.enabled !== false;
  const sidebarCollapsible = sidebarConfig.collapsible !== false;
  const sidebarDefaultExpanded = sidebarConfig.defaultExpanded !== false;

  const topbarEnabled = topbarConfig.enabled !== false;

  return (
    <div className={styles.layout}>
      <Header />

      {navigationType === "topbar" && (
        <Topbar
          items={navigationItems}
          enabled={topbarEnabled}
        />
      )}

      <div className={`${styles.body} ${navigationType === "sidebar" ? styles.bodyWithSidebar : ""}`}>
        {navigationType === "sidebar" && (
          <Sidebar
            items={navigationItems}
            enabled={sidebarEnabled}
            collapsible={sidebarCollapsible}
            defaultExpanded={sidebarDefaultExpanded}
          />
        )}
        <main className={styles.main}>
          <div className={styles.content}>{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
