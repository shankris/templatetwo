"use client";

import Sidebar from "./Sidebar";
import sidebarItems from "@/data/sidebarTest.json";

export default function SidebarTest() {
  return (
    <div
      style={{
        height: "500px",
        display: "flex",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <Sidebar
        items={sidebarItems}
        enabled={true}
        collapsible={true}
        defaultExpanded={true}
      />

      <main
        style={{
          flex: 1,
          padding: "2rem",
          color: "var(--text-primary)",
        }}
      >
        <h1>Sidebar Test</h1>

        <p>This area represents the application content.</p>
      </main>
    </div>
  );
}
