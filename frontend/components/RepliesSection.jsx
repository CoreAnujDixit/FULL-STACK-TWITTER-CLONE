import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/react";
import { FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";

function RepliesSection({ tweetId, replies, onRepliesUpdate }) {
  const { user } = useUser();
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleAddReply = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      await axios.post(`/api/tweets/${tweetId}/reply`, {
        text: replyText,
        author: {
          userId: user?.id,
          fullName: user?.fullName,
          username: user?.unsafeMetadata?.username || user?.username,
          imageUrl: user?.imageUrl,
        },
      });
      setReplyText("");
      onRepliesUpdate();
    } catch (error) {
      alert("Error adding reply: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await axios.delete(`/api/tweets/${tweetId}/reply/${replyId}`, {
        data: { userId: user?.id },
      });
      onRepliesUpdate();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting reply");
    }
  };

  return (
    <div className="mt-3 ml-10 sm:ml-13 pl-3 border-l-2 border-gray-100">
      {/* Reply composer */}
      <div className="flex gap-2 mb-3">
        <img
          src={user?.imageUrl}
          alt={user?.fullName}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply…"
            className="w-full border rounded-xl px-3 py-2 text-xs sm:text-sm resize-none outline-none focus:ring-2 focus:ring-blue-200 transition-all bg-gray-50"
            rows="2"
          />
          <button
            onClick={handleAddReply}
            disabled={loading || !replyText.trim()}
            className="mt-1.5 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Replying…" : "Reply"}
          </button>
        </div>
      </div>

      {/* Toggle replies */}
      {replies && replies.length > 0 && (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center gap-1 text-blue-500 text-xs font-semibold mb-2 hover:text-blue-700 transition-colors"
        >
          {showReplies ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
          {showReplies ? `Hide ${replies.length} ${replies.length === 1 ? "reply" : "replies"}` : `Show ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
        </button>
      )}

      {/* Replies list */}
      {showReplies && replies && replies.length > 0 && (
        <div className="space-y-2">
          {replies.map((reply) => (
            <div key={reply._id} className="bg-gray-50 rounded-xl p-3">
              <div className="flex gap-2">
                <img
                  src={reply.author?.imageUrl}
                  alt={reply.author?.fullName}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-xs truncate max-w-[100px] sm:max-w-none">
                      {reply.author?.fullName}
                    </span>
                    <span className="text-gray-500 text-xs">@{reply.author?.username}</span>
                  </div>
                  <p className="text-gray-800 text-xs sm:text-sm mt-0.5 break-words">{reply.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-400 text-xs">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </p>
                    {reply.author?.userId === user?.id && (
                      <button
                        onClick={() => handleDeleteReply(reply._id)}
                        className="flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-medium transition-colors"
                      >
                        <FiTrash2 size={11} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RepliesSection;