import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: 200, padding: 20 }}>
        <h3>Sidebar</h3>
      </aside>

      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  );
}