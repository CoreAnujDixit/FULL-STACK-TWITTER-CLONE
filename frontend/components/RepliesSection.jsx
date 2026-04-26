import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/react";
import { FiTrash2 } from "react-icons/fi";

function RepliesSection({ tweetId, replies, onRepliesUpdate }) {
  const { user } = useUser();
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleAddReply = async () => {
    if (!replyText.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        `/api/tweets/${tweetId}/reply`,
        {
          text: replyText,
          author: {
            userId: user?.id,
            fullName: user?.fullName,
            username: user?.unsafeMetadata?.username || user?.username,
            imageUrl: user?.imageUrl,
          },
        }
      );
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
      await axios.delete(
        `/api/tweets/${tweetId}/reply/${replyId}`,
        {
          data: { userId: user?.id },
        }
      );
      onRepliesUpdate();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting reply");
    }
  };

  return (
    <div className="mt-4 pl-4 border-l-2 border-gray-200">
      {/* Reply Form */}
      <div className="flex gap-3 mb-4">
        <img
          src={user?.imageUrl}
          alt={user?.fullName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply to this tweet..."
            className="w-full border rounded-lg p-2 text-sm resize-none"
            rows="2"
          />
          <button
            onClick={handleAddReply}
            disabled={loading || !replyText.trim()}
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Replying..." : "Reply"}
          </button>
        </div>
      </div>

      {/* Show/Hide Replies */}
      {replies && replies.length > 0 && (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="text-blue-500 hover:underline text-sm mb-3 font-semibold"
        >
          {showReplies ? `Hide ${replies.length} replies` : `Show ${replies.length} replies`}
        </button>
      )}

      {/* Replies List */}
      {showReplies && replies && replies.length > 0 && (
        <div className="space-y-3 mt-3">
          {replies.map((reply) => (
            <div key={reply._id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex gap-2">
                <img
                  src={reply.author?.imageUrl}
                  alt={reply.author?.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{reply.author?.fullName}</h4>
                    <span className="text-gray-500 text-xs">@{reply.author?.username}</span>
                  </div>
                  <p className="text-gray-800 text-sm mt-1">{reply.text}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(reply.createdAt).toLocaleString()}
                  </p>

                  {/* Delete Reply Button */}
                  {reply.author?.userId === user?.id && (
                    <button
                      onClick={() => handleDeleteReply(reply._id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs mt-2 font-semibold"
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  )}
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
