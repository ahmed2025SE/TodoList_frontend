import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); 
    } catch (e) {
 
    } finally {
      localStorage.removeItem("token"); 
      navigate("/login");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
  
      <aside
        style={{
          width: 220,
          padding: 20,
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3>Todo App</h3>

          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/home"> Home</Link>
            <Link to="/mylists"> My Lists</Link>
            <Link to="/completed"> Completed</Link>
            <Link to="/upcoming"> Upcoming</Link>
          </nav>
        </div>

      
        <button
          onClick={handleLogout}
          style={{
            marginTop: 20,
            padding: "8px 10px",
            border: "1px solid #ccc",
            background: "#f8f8f8",
            cursor: "pointer",
          }}
        >
           Logout
        </button>
      </aside>

    
      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  );
}