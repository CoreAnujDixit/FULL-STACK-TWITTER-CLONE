import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";

function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose(); // Close mobile menu after navigation
  };

  return (
    <div className="w-64 md:w-1/4 h-screen sticky top-0 border-r bg-white p-6">
      {/* Close button for mobile */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <h1
        onClick={() => handleNavigation("/")}
        className="text-2xl md:text-3xl font-bold text-blue-500 mb-10 cursor-pointer hover:text-blue-600 transition-colors"
      >
        Twitter Clone
      </h1>

      <ul className="space-y-6 text-lg font-medium">
        <li
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-3 hover:text-blue-500 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <AiOutlineHome size={24} /> Home
        </li>
        <li className="flex items-center gap-3 hover:text-blue-500 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
          <AiOutlineSearch size={24} /> Explore
        </li>
        <li
          onClick={() => handleNavigation("/profile")}
          className="flex items-center gap-3 hover:text-blue-500 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <AiOutlineUser size={24} /> Profile
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;