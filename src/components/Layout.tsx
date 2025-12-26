import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          padding: 20,
          borderRight: "1px solid #ddd",
        }}
      >
        <h3>Todo App</h3>

        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link to="/home">🏠 Home</Link>
          <Link to="/mylists">📂 My Lists</Link>
          <Link to="/completed">✅ Completed</Link>
          <Link to="/upcoming">⏳ Upcoming</Link>
        </nav>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  );
}