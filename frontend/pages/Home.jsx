import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import RightPanel from "../components/RightPanel";

function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Layout */}
      <div className="flex">
        {/* Sidebar - Hidden on mobile, shown as overlay, static on desktop */}
        <div className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 fixed md:static inset-y-0 left-0 z-50 md:z-auto md:w-1/5 w-64`}>
          <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
        </div>

        {/* Main Content - Feed */}
        <div className="flex-1 w-full md:w-3/5">
          <Feed />
        </div>

        {/* Right Panel - Hidden on mobile and tablet */}
        <div className="hidden lg:block lg:w-1/5">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}

export default Home;