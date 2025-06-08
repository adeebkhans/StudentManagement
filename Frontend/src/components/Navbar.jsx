import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-white font-bold text-lg">
          Student Management
        </Link>
        <Link to="/students" className="text-white hover:underline">
          Students
        </Link>
        <Link to="/fees" className="text-white hover:underline">
          Fees
        </Link>
        <Link to="/" className="text-white hover:underline">
          Dashboard
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 px-4 py-1 rounded font-semibold hover:bg-gray-100 transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;