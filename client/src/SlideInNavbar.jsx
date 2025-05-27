import { useState } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  FileText,
  Users,
  Package,
  Menu,
  X,
  LogOut,
  BarChart3
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import { ThemeToggle } from "./components/theme-toggle";

export default function SlideNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    swal("Logout Successful", "You have been logged out.", "success").then(() => {
      navigate('/login');
    });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/sales", icon: <BarChart3 size={20} />, label: "Sales" },
    { path: "/reciept", icon: <FileText size={20} />, label: "Receipt" },
    { path: "/users", icon: <Users size={20} />, label: "Users" },
    { path: "/products", icon: <Package size={20} />, label: "Products" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 shadow-xl transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        {isOpen && (
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Inventory</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleNavbar}
          className="ml-auto text-slate-400 hover:text-white hover:bg-slate-700/50"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-blue-600/20 text-blue-400"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            } ${!isOpen && "justify-center"}`}
          >
            {item.icon}
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50 space-y-2">
        {/* Theme Toggle Button */}
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${!isOpen && "justify-center"}`}>
          <ThemeToggle
            variant="ghost"
            size="icon"
          />
          {isOpen && <span className="text-slate-400">Toggle Theme</span>}
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 ${
            !isOpen && "justify-center"
          }`}
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
