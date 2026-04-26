import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiX } from "react-icons/fi";

const TRENDING = ["#MERN", "#React", "#JavaScript", "#NodeJS", "#TailwindCSS"];

function RightPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/users/search?query=${searchQuery}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    window.open(`/profile/${userId}`, "_blank");
  };

  return (
    <div className="h-screen sticky top-0 bg-white border-l overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Search Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FiSearch size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-full py-2.5 pl-9 pr-9 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setSearchResults([]); }}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchQuery ? (
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-base">Results</h2>
            </div>
            {loading ? (
              <div className="px-4 py-6 text-center">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                {searchResults.map((u) => (
                  <button
                    key={u.userId}
                    onClick={() => handleUserClick(u.userId)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors text-left"
                  >
                    <img
                      src={u.imageUrl}
                      alt={u.fullName}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{u.fullName}</p>
                      <p className="text-gray-500 text-xs truncate">@{u.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="px-4 py-6 text-gray-500 text-sm text-center">No users found</p>
            )}
          </div>
        ) : (
          /* Trending */
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-base">Trending</h2>
            </div>
            <div>
              {TRENDING.map((tag) => (
                <button
                  key={tag}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors text-sm text-blue-500 font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RightPanel;