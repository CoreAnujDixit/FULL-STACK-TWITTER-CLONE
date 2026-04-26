import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-1/4 h-screen sticky top-0 border-r bg-white p-6">
      <h1 
        onClick={() => navigate("/")}
        className="text-3xl font-bold text-blue-500 mb-10 cursor-pointer hover:text-blue-600 transition-colors"
      >
        Twitter Clone
      </h1>

      <ul className="space-y-6 text-lg font-medium">
        <li
          onClick={() => navigate("/")}
          className="flex items-center gap-3 hover:text-blue-500 cursor-pointer"
        >
          <AiOutlineHome size={24} /> Home
        </li>
        <li className="flex items-center gap-3 hover:text-blue-500 cursor-pointer">
          <AiOutlineSearch size={24} /> Explore
        </li>
        <li
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 hover:text-blue-500 cursor-pointer"
        >
          <AiOutlineUser size={24} /> Profile
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;