import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

function RightPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/users/search?query=${searchQuery}`
      );
      setSearchResults(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Search error:", error);
      setLoading(false);
    }
  };

  const handleUserClick = (userId, username) => {
    // Navigate to user's profile (you can implement this as needed)
    window.open(`/profile/${userId}`, "_blank");
  };

  return (
    <div className="w-full h-screen sticky top-0 bg-white p-4 md:p-6 border-l text-sm md:text-base">
      {/* Search Box */}
      <div className="bg-gray-100 rounded-2xl p-3 mb-4 flex items-center gap-2">
        <FiSearch size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search users by ID or username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-100 outline-none w-full text-sm"
        />
      </div>

      {/* Search Results */}
      <div className="bg-gray-50 rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4">
          {searchQuery ? "Search Results" : "Trending"}
        </h2>

        {searchQuery ? (
          loading ? (
            <p className="text-gray-500 text-sm">Searching...</p>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => handleUserClick(user.userId, user.username)}
                  className="p-3 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={user.imageUrl}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {user.fullName}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No users found</p>
          )
        ) : (
          <div className="space-y-3">
            <p className="hover:text-blue-500 cursor-pointer text-sm">#MERN</p>
            <p className="hover:text-blue-500 cursor-pointer text-sm">#React</p>
            <p className="hover:text-blue-500 cursor-pointer text-sm">
              #JavaScript
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RightPanel;