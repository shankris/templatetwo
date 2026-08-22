// src/app/[local]/(public)/components/layout.js

import Sidebar from "@/components/Layout/Sidebar/Sidebar";
import componentNavigation from "@/data/componentNavigation.json";

export default function ComponentsLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - var(--header-height) - var(--footer-height))",
      }}
    >
      <Sidebar
        items={componentNavigation}
        enabled={true}
        collapsible={true}
        defaultExpanded={true}
        defaultExpandedLevel={2}
      />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "2rem",
          color: "var(--text-primary)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
