"use client";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";

import styles from "./WebAppLayout.module.css";

export default function WebAppLayout({ children, sidebarItems = [], sidebarEnabled = true, sidebarCollapsible = true, sidebarDefaultExpanded = true }) {
  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.body}>
        <Sidebar
          items={sidebarItems}
          enabled={sidebarEnabled}
          collapsible={sidebarCollapsible}
          defaultExpanded={sidebarDefaultExpanded}
        />

        <main className={styles.main}>{children}</main>
      </div>

      <Footer />
    </div>
  );
}
