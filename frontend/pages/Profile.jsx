import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import RepliesSection from "../components/RepliesSection";
import { FiHeart, FiTrash2, FiMessageCircle, FiShare, FiArrowLeft } from "react-icons/fi";
import { AiOutlineRetweet } from "react-icons/ai";

function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchUserTweets = async () => {
    try {
      const res = await axios.get("/api/tweets");
      const userTweets = res.data.filter(
        (tweet) =>
          tweet.author?.userId === user?.id ||
          tweet.retweets?.some((rt) => rt.userId === user?.id)
      );
      setTweets(userTweets);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  useEffect(() => {
    if (user?.id) fetchUserTweets();
  }, [user?.id]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tweets/${id}`, { data: { userId: user?.id } });
      fetchUserTweets();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting tweet");
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.put(`/api/tweets/like/${id}`, { userId: user?.id });
      fetchUserTweets();
    } catch (error) {
      alert("Error liking tweet: " + error.message);
    }
  };

  const handleRetweet = async (id) => {
    try {
      await axios.put(`/api/tweets/retweet/${id}`, { userId: user?.id });
      fetchUserTweets();
    } catch (error) {
      alert("Error retweeting: " + error.message);
    }
  };

  const handleShare = (tweet) => {
    const shareText = `Check out this tweet from @${tweet.author?.username}: "${tweet.text}"`;
    if (navigator.share) {
      navigator.share({ title: "Twitter Clone", text: shareText });
    } else {
      alert("Share: " + shareText);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={() => fetchUserTweets()}
      />

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b flex items-center gap-4 px-4 py-3">
        <button
          onClick={() => navigate("/")}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-base font-bold leading-tight">{user?.fullName}</h1>
          <p className="text-xs text-gray-500">{tweets.length} {tweets.length === 1 ? "tweet" : "tweets"}</p>
        </div>
      </div>

      {/* Cover Banner */}
      <div
        className="w-full h-36 sm:h-48 bg-gradient-to-r from-blue-400 to-blue-600"
        style={{
          backgroundImage: user?.unsafeMetadata?.coverImage
            ? `url(${user.unsafeMetadata.coverImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Profile Info */}
      <div className="px-4 pb-4 border-b relative">
        {/* Avatar + Edit button row */}
        <div className="flex items-end justify-between -mt-10 sm:-mt-14 mb-3">
          <img
            src={user?.imageUrl}
            alt={user?.fullName}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-sm"
          />
          <button
            onClick={() => setIsEditOpen(true)}
            className="border border-gray-300 text-gray-800 px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Edit profile
          </button>
        </div>

        <div>
          <h1 className="text-xl font-bold">{user?.fullName}</h1>
          <p className="text-gray-500 text-sm">@{user?.unsafeMetadata?.username || user?.username}</p>

          {user?.unsafeMetadata?.bio && (
            <p className="text-gray-800 mt-2 text-sm leading-relaxed">{user.unsafeMetadata.bio}</p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-gray-500 text-sm">
            {user?.unsafeMetadata?.location && (
              <span className="flex items-center gap-1">
                📍 {user.unsafeMetadata.location}
              </span>
            )}
            {user?.unsafeMetadata?.website && (
              <a
                href={user.unsafeMetadata.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:underline truncate max-w-[200px]"
              >
                🔗 {user.unsafeMetadata.website}
              </a>
            )}
            <span className="flex items-center gap-1">
              📅 Joined {new Date(user?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
            </span>
          </div>
        </div>
      </div>

      {/* Tweets Tab */}
      <div className="px-4 py-2 border-b">
        <span className="inline-block text-sm font-bold text-blue-500 border-b-2 border-blue-500 pb-2 px-1">
          Tweets
        </span>
      </div>

      {/* User Tweets */}
      <div>
        {tweets.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-gray-500 text-lg font-medium">No tweets yet</p>
            <p className="text-gray-400 text-sm mt-1">When you tweet, they'll show up here.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-5 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors text-sm font-semibold"
            >
              Go to Home
            </button>
          </div>
        ) : (
          tweets.map((tweet) => (
            <article
              key={tweet._id}
              className="border-b px-4 py-4 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex gap-3">
                <img
                  src={tweet.author?.imageUrl}
                  alt={tweet.author?.fullName}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm truncate">{tweet.author?.fullName}</span>
                    <span className="text-gray-500 text-sm">@{tweet.author?.username}</span>
                  </div>

                  <p className="mt-1 text-gray-900 text-sm sm:text-base break-words leading-relaxed">
                    {tweet.text}
                  </p>

                  {tweet.image && (
                    <img
                      src={tweet.image}
                      alt="Tweet"
                      className="mt-3 w-full max-h-64 sm:max-h-96 object-cover rounded-2xl border border-gray-100"
                    />
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(tweet.createdAt).toLocaleString()}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3 -ml-2 max-w-xs text-gray-500">
                    <button className="flex items-center gap-1.5 p-2 rounded-full hover:text-blue-500 hover:bg-blue-50 transition-colors">
                      <FiMessageCircle size={16} />
                      <span className="text-xs">{tweet.replies?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => handleRetweet(tweet._id)}
                      className={`flex items-center gap-1.5 p-2 rounded-full transition-colors hover:bg-green-50 ${
                        tweet.retweets?.some((rt) => rt.userId === user?.id)
                          ? "text-green-500"
                          : "hover:text-green-500"
                      }`}
                    >
                      <AiOutlineRetweet size={17} />
                      <span className="text-xs">{tweet.retweets?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => handleLike(tweet._id)}
                      className={`flex items-center gap-1.5 p-2 rounded-full transition-colors hover:bg-red-50 ${
                        tweet.likes?.some((like) => like.userId === user?.id)
                          ? "text-red-500"
                          : "hover:text-red-500"
                      }`}
                    >
                      <FiHeart
                        size={16}
                        fill={
                          tweet.likes?.some((like) => like.userId === user?.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                      <span className="text-xs">{tweet.likes?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(tweet._id)}
                      className="flex items-center gap-1.5 p-2 rounded-full hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>

                    <button
                      onClick={() => handleShare(tweet)}
                      className="flex items-center gap-1.5 p-2 rounded-full hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <FiShare size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <RepliesSection
                tweetId={tweet._id}
                replies={tweet.replies}
                onRepliesUpdate={fetchUserTweets}
              />
            </article>
          ))
        )}
      </div>

      {/* Bottom padding for mobile tab bar */}
      <div className="md:hidden h-16" />
    </div>
  );
}

export default Profile;