import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../api/auth";

// Icons
import { 
  FaHome, 
  FaList, 
  FaCheckCircle, 
  FaClock, 
  FaSignOutAlt
} from "react-icons/fa";

// NavItem Component
function NavItem({ to, icon, text }: { to: string; icon: ReactNode; text: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to}
      className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-all duration-200 ${
        isActive 
          ? 'bg-white bg-opacity-20 text-white font-medium' 
          : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-10'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  // const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUser = user?.username || 'User';
  const userInitial = currentUser.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-purple-600 to-purple-500 text-white flex flex-col z-20">
        {/* User Profile Section */}
        <div className="p-6 border-b border-white border-opacity-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl font-bold text-white">
              {userInitial}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{currentUser}</h3>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem to="/home" icon={<FaHome />} text="Home" />
          <NavItem to="/upcoming" icon={<FaClock />} text="Upcoming" />
          <NavItem to="/completed" icon={<FaCheckCircle />} text="Completed" />
          <NavItem to="/mylists" icon={<FaList />} text="My Lists" />
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white border-opacity-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors duration-200 text-white text-opacity-80 hover:text-opacity-100"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 ml-64">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}