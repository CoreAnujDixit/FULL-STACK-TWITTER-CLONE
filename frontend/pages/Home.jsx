import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import RightPanel from "../components/RightPanel";

function Home() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar — hidden on mobile, shown on md+ */}
        <div className="hidden md:block md:w-64 lg:w-72 shrink-0">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "search" ? (
            /* On mobile, search tab shows RightPanel full screen */
            <div className="md:hidden">
              <RightPanel />
            </div>
          ) : (
            <Feed />
          )}
          {/* Feed always visible on md+ */}
          <div className="hidden md:block">
            {activeTab === "home" && null /* Feed rendered above */}
          </div>
        </div>

        {/* Right Panel — only on lg+ */}
        <div className="hidden lg:block lg:w-80 shrink-0">
          <RightPanel />
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex items-center justify-around h-16 px-2">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors ${
            activeTab === "home" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <svg className="w-6 h-6" fill={activeTab === "home" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs font-medium">Home</span>
        </button>

        <button
          onClick={() => setActiveTab("search")}
          className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors ${
            activeTab === "search" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs font-medium">Search</span>
        </button>

        <button
          onClick={() => { window.location.href = "/profile"; }}
          className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors text-gray-500"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs font-medium">Profile</span>
        </button>
      </nav>

      {/* Bottom padding so content isn't hidden behind tab bar on mobile */}
      <div className="md:hidden h-16" />
    </div>
  );
}

export default Home;