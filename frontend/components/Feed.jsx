import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/react";
import RepliesSection from "./RepliesSection";
import { FiHeart, FiTrash2, FiMessageCircle, FiShare, FiImage, FiX } from "react-icons/fi";
import { AiOutlineRetweet } from "react-icons/ai";

const CLOUDINARY_CLOUD_NAME = "dk13uacrq";
const CLOUDINARY_UPLOAD_PRESET = "twitter_clone";

function Feed() {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [tweets, setTweets] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const fetchTweets = async () => {
    const res = await axios.get("/api/tweets");
    setTweets(res.data);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!selectedImage) return null;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setUploading(false);
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert("Error uploading image: " + error.message);
      setUploading(false);
      return null;
    }
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleTweet = async () => {
    if (!text.trim() && !selectedImage) return;
    try {
      let imageUrl = uploadedImageUrl;
      if (selectedImage && !uploadedImageUrl) {
        imageUrl = await uploadImageToCloudinary();
      }
      await axios.post("/api/tweets/create", {
        text,
        image: imageUrl || null,
        author: {
          userId: user?.id,
          fullName: user?.fullName,
          username: user?.unsafeMetadata?.username || user?.username,
          imageUrl: user?.imageUrl,
        },
      });
      setText("");
      clearImageSelection();
      fetchTweets();
    } catch (error) {
      alert("Error creating tweet: " + error.message);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.put(`/api/tweets/like/${id}`, { userId: user?.id });
      fetchTweets();
    } catch (error) {
      alert("Error liking tweet: " + error.message);
    }
  };

  const handleRetweet = async (id) => {
    try {
      await axios.put(`/api/tweets/retweet/${id}`, { userId: user?.id });
      fetchTweets();
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tweets/${id}`, { data: { userId: user?.id } });
      fetchTweets();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting tweet");
    }
  };

  return (
    <div className="w-full min-h-screen border-r bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-4 py-3">
        <h2 className="text-xl font-bold">Home</h2>
      </div>

      {/* Tweet Composer */}
      <div className="border-b px-4 py-4">
        <div className="flex gap-3">
          <img
            src={user?.imageUrl}
            alt={user?.fullName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's happening?"
              className="w-full outline-none resize-none text-lg placeholder-gray-400 bg-transparent"
              rows="3"
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3 relative rounded-2xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 sm:max-h-80 object-cover"
                />
                <button
                  onClick={clearImageSelection}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <label className="cursor-pointer text-blue-500 hover:text-blue-600 p-2 -ml-2 rounded-full hover:bg-blue-50 transition-colors">
                <FiImage size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleTweet}
                disabled={(!text.trim() && !selectedImage) || uploading}
                className="bg-blue-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
              >
                {uploading ? "Uploading…" : "Tweet"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tweets Feed */}
      <div>
        {tweets.map((tweet) => (
          <article
            key={tweet._id}
            className="border-b px-4 py-4 hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex gap-3">
              <img
                src={tweet.author?.imageUrl}
                alt={tweet.author?.fullName}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                {/* Author row */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-sm sm:text-base leading-tight truncate max-w-[140px] sm:max-w-none">
                    {tweet.author?.fullName}
                  </span>
                  <span className="text-gray-500 text-sm truncate">
                    @{tweet.author?.username}
                  </span>
                  <span className="text-gray-400 text-xs hidden sm:inline">·</span>
                  <span className="text-gray-400 text-xs hidden sm:inline">
                    {new Date(tweet.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Tweet text */}
                <p className="mt-1 text-gray-900 text-sm sm:text-base break-words leading-relaxed">
                  {tweet.text}
                </p>

                {/* Tweet Image */}
                {tweet.image && (
                  <img
                    src={tweet.image}
                    alt="Tweet"
                    className="mt-3 w-full max-h-72 sm:max-h-96 object-cover rounded-2xl border border-gray-100"
                  />
                )}

                {/* Timestamp on mobile */}
                <p className="sm:hidden text-xs text-gray-400 mt-2">
                  {new Date(tweet.createdAt).toLocaleString()}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-3 -ml-2 max-w-xs text-gray-500">
                  <button className="flex items-center gap-1.5 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 transition-colors group">
                    <FiMessageCircle size={17} />
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
                    <AiOutlineRetweet size={18} />
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
                      size={17}
                      fill={
                        tweet.likes?.some((like) => like.userId === user?.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                    <span className="text-xs">{tweet.likes?.length || 0}</span>
                  </button>

                  <button
                    onClick={() => handleShare(tweet)}
                    className="flex items-center gap-1.5 p-2 rounded-full hover:text-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <FiShare size={17} />
                  </button>

                  {tweet.author?.userId === user?.id && (
                    <button
                      onClick={() => handleDelete(tweet._id)}
                      className="flex items-center gap-1.5 p-2 rounded-full hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 size={17} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Replies Section */}
            <RepliesSection
              tweetId={tweet._id}
              replies={tweet.replies}
              onRepliesUpdate={fetchTweets}
            />
          </article>
        ))}
      </div>
    </div>
  );
}

export default Feed;