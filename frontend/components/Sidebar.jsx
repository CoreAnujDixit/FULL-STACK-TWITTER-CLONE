import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: "home",
      label: "Home",
      path: "/",
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: "search",
      label: "Explore",
      path: null,
      icon: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      path: "/profile",
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const handleNav = (item) => {
    if (item.path) {
      navigate(item.path);
    }
    if (setActiveTab) setActiveTab(item.id);
  };

  const isActive = (item) => {
    if (item.id === "profile") return location.pathname === "/profile";
    if (item.id === "home") return location.pathname === "/" && activeTab === "home";
    return activeTab === item.id;
  };

  return (
    <aside className="h-screen sticky top-0 flex flex-col border-r bg-white px-4 py-6">
      {/* Logo */}
      <button
        onClick={() => handleNav({ id: "home", path: "/" })}
        className="flex items-center gap-2 mb-8 px-2 group"
      >
        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </div>
        <span className="text-xl font-bold text-blue-500 group-hover:text-blue-600 transition-colors hidden lg:block">
          Twitter Clone
        </span>
      </button>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl font-semibold transition-all duration-150 group w-full text-left ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className={active ? "text-blue-500" : "text-gray-500 group-hover:text-gray-700"}>
                {item.icon(active)}
              </span>
              <span className="hidden lg:block text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;