import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import RepliesSection from "../components/RepliesSection";
import { FiHeart, FiTrash2, FiMessageCircle, FiShare } from "react-icons/fi";
import { AiOutlineRetweet } from "react-icons/ai";

function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchUserTweets = async () => {
    try {
      const res = await axios.get("/api/tweets");
      // Filter tweets: original tweets from user OR tweets the user has retweeted
      const userTweets = res.data.filter(
        (tweet) => 
          tweet.author?.userId === user?.id || 
          tweet.retweets?.some(rt => rt.userId === user?.id)
      );
      setTweets(userTweets);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserTweets();
    }
  }, [user?.id]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tweets/${id}`, {
        data: { userId: user?.id },
      });
      fetchUserTweets();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting tweet");
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.put(`/api/tweets/like/${id}`, {
        userId: user?.id,
      });
      fetchUserTweets();
    } catch (error) {
      alert("Error liking tweet: " + error.message);
    }
  };

  const handleRetweet = async (id) => {
    try {
      await axios.put(`/api/tweets/retweet/${id}`, {
        userId: user?.id,
      });
      fetchUserTweets();
    } catch (error) {
      alert("Error retweeting: " + error.message);
    }
  };

  const handleShare = (tweet) => {
    const text = `Check out this tweet from @${tweet.author?.username}: "${tweet.text}"`;
    if (navigator.share) {
      navigator.share({
        title: 'Twitter Clone',
        text: text,
      });
    } else {
      alert("Share: " + text);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={() => fetchUserTweets()}
      />

      {/* Cover Banner */}
      <div
        className="w-full h-48 bg-gradient-to-r from-blue-400 to-blue-600"
        style={{
          backgroundImage: user?.unsafeMetadata?.coverImage
            ? `url(${user.unsafeMetadata.coverImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Profile Info */}
      <div className="border-b p-4 md:p-6 pb-6 md:pb-8 bg-white relative">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-blue-500 hover:text-blue-700 font-semibold text-base md:text-lg flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Profile Picture and Edit Button */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between -mt-12 md:-mt-16 mb-4 gap-4">
          <img
            src={user?.imageUrl}
            alt={user?.fullName}
            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-4 border-white mx-auto sm:mx-0"
          />
          <button
            onClick={() => setIsEditOpen(true)}
            className="border border-blue-500 text-blue-500 px-4 md:px-6 py-2 rounded-full font-semibold hover:bg-blue-50 text-sm md:text-base self-center sm:self-start"
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Details */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold">{user?.fullName}</h1>
          <p className="text-gray-500 text-base md:text-lg">@{user?.unsafeMetadata?.username || user?.username}</p>

          {user?.unsafeMetadata?.bio && (
            <p className="text-gray-700 mt-3 text-sm md:text-base">{user.unsafeMetadata.bio}</p>
          )}

          <div className="flex flex-wrap justify-center sm:justify-start gap-4 md:gap-6 mt-4 text-gray-500 text-xs md:text-sm">
            {user?.unsafeMetadata?.location && (
              <div className="flex items-center gap-1">
                📍 {user.unsafeMetadata.location}
              </div>
            )}
            {user?.unsafeMetadata?.website && (
              <a
                href={user.unsafeMetadata.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:underline"
              >
                🔗 {user.unsafeMetadata.website}
              </a>
            )}
            <div className="flex items-center gap-1">
              📅 Joined {new Date(user?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
            </div>
          </div>

          <p className="text-gray-500 mt-4">
            {tweets.length} {tweets.length === 1 ? "tweet" : "tweets"}
          </p>
        </div>
      </div>

      {/* User Tweets */}
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {tweets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tweets yet. Start tweeting!</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
            >
              Go to Home
            </button>
          </div>
        ) : (
          tweets.map((tweet) => (
            <div
              key={tweet._id}
              className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <img
                  src={tweet.author?.imageUrl}
                  alt={tweet.author?.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{tweet.author?.fullName}</h3>
                    <span className="text-gray-500 text-sm">@{tweet.author?.username}</span>
                  </div>

                  <p className="mt-2 text-gray-800">{tweet.text}</p>

                  {/* Tweet Image */}
                  {tweet.image && (
                    <img
                      src={tweet.image}
                      alt="Tweet"
                      className="mt-3 w-full max-h-96 object-cover rounded-xl"
                    />
                  )}

                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(tweet.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* bottom actions */}
              <div className="flex justify-between mt-4 px-2 text-gray-500">
                <button className="flex items-center gap-2 hover:text-blue-500 group transition-colors">
                  <FiMessageCircle size={18} />
                  <span className="text-sm group-hover:bg-blue-100 group-hover:text-blue-500 rounded-full px-2 py-1">
                    {tweet.replies?.length || 0}
                  </span>
                </button>

                <button 
                  onClick={() => handleRetweet(tweet._id)}
                  className={`flex items-center gap-2 transition-colors ${tweet.retweets?.some(rt => rt.userId === user?.id) ? 'text-green-500' : 'hover:text-green-500'}`}
                >
                  <AiOutlineRetweet size={18} />
                  <span className="text-sm">{tweet.retweets?.length || 0}</span>
                </button>

                <button 
                  onClick={() => handleLike(tweet._id)}
                  className={`flex items-center gap-2 transition-colors ${
                    tweet.likes?.some(like => like.userId === user?.id) ? 'text-red-500' : 'hover:text-red-500'
                  }`}
                >
                  <FiHeart 
                    size={18} 
                    fill={tweet.likes?.some(like => like.userId === user?.id) ? 'currentColor' : 'none'} 
                  />
                  <span className="text-sm">{tweet.likes?.length || 0}</span>
                </button>

                <button
                  onClick={() => handleDelete(tweet._id)}
                  className="flex items-center gap-2 hover:text-red-500 transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>

                <button 
                  onClick={() => handleShare(tweet)}
                  className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                >
                  <FiShare size={18} />
                </button>
              </div>

              {/* Replies Section */}
              <RepliesSection
                tweetId={tweet._id}
                replies={tweet.replies}
                onRepliesUpdate={fetchUserTweets}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
