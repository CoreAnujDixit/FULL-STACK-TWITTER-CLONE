import React from "react";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import RightPanel from "../components/RightPanel";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex">
        <Sidebar />
        <Feed />
        <RightPanel />
      </div>
    </div>
  );
}

export default Home;