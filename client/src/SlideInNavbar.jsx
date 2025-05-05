import React, { useState } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  FileText,
  Users,
  Truck,
  Package,
  Menu,
  X,
} from "lucide-react"; // Importing lucide-react icons
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import './nav.css'; // Import external CSS for styling
import Logout from "./Logout";

export default function SlideNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the navbar
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`navbar-container ${isOpen ? "active" : ""}`}>
      <button className="toggle-btn" onClick={toggleNavbar}>
        {isOpen ? <X /> : <Menu />}
      </button>
      <nav className="navbar">
        <Link to="/" className="nav-link">
          <LayoutDashboard className="nav-icon" />
          {isOpen && <span>Dashboard</span>}
        </Link>
        <Link to="/sales" className="nav-link">
          <CircleDollarSign className="nav-icon" />
          {isOpen && <span>Sales</span>}
        </Link>
        <Link to="/reciept" className="nav-link">
          <FileText className="nav-icon" />
          {isOpen && <span>Receipt</span>}
        </Link>
        <Link to="/users" className="nav-link">
          <Users className="nav-icon" />
          {isOpen && <span>User</span>}
        </Link>
       
        <Link to="/products" className="nav-link">
          <Package className="nav-icon" />
          {isOpen && <span>Product</span>}
        </Link>
        <Logout/>
      </nav>
    </div>
  );
}
