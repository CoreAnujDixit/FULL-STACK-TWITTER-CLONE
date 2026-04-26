import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/react";
import RepliesSection from "./RepliesSection";
import { FiHeart, FiTrash2, FiMessageCircle, FiShare, FiImage } from "react-icons/fi";
import { AiOutlineRetweet } from "react-icons/ai";

// Cloudinary Configuration
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

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Cloudinary
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

  // Clear image selection
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

      // Upload image to Cloudinary if selected
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
      await axios.put(`/api/tweets/like/${id}`, {
        userId: user?.id,
      });
      fetchTweets();
    } catch (error) {
      alert("Error liking tweet: " + error.message);
    }
  };

  const handleRetweet = async (id) => {
    try {
      await axios.put(`/api/tweets/retweet/${id}`, {
        userId: user?.id,
      });
      fetchTweets();
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
      // Fallback for browsers that don't support share API
      const tweetText = `Check out this tweet from @${tweet.author?.username}: "${tweet.text}"`;
      alert("Share: " + tweetText);
    }
  };

//delete wala
const handleDelete = async (id) => {
  try {
    await axios.delete(`/api/tweets/${id}`, {
      data: { userId: user?.id },
    });
    fetchTweets();
  } catch (error) {
    alert(error.response?.data?.message || "Error deleting tweet");
  }
};
  return (
    <div className="w-full md:w-2/4 min-h-screen border-r bg-white p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Home</h2>

      {/* Tweet Composer */}
      <div className="border rounded-2xl p-4 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          className="w-full outline-none resize-none text-base md:text-lg"
          rows="3"
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4 relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-80 object-cover rounded-xl"
            />
            <button
              onClick={clearImageSelection}
              className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80"
            >
              ✕
            </button>
          </div>
        )}

        {/* Image Upload & Tweet Button */}
        <div className="flex items-center justify-between mt-4">
          <label className="cursor-pointer text-blue-500 hover:text-blue-600">
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
            className="bg-blue-500 text-white px-4 md:px-6 py-2 rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50 text-sm md:text-base"
          >
            {uploading ? "Uploading..." : "Tweet"}
          </button>
        </div>
      </div>

      {/* Tweets Feed */}
      <div className="mt-6 space-y-4">
        {tweets.map((tweet) => (
          <div
            key={tweet._id}
            className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Top Section */}
            <div className="flex items-start gap-3">
              <img
                src={tweet.author?.imageUrl}
                alt={tweet.author?.fullName}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-sm md:text-base truncate">{tweet.author?.fullName}</h3>
                  <span className="text-gray-500 text-xs md:text-sm truncate">@{tweet.author?.username}</span>
                </div>

                <p className="mt-2 text-gray-800 text-sm md:text-base break-words">{tweet.text}</p>

                {/* Tweet Image */}
                {tweet.image && (
                  <img
                    src={tweet.image}
                    alt="Tweet"
                    className="mt-3 w-full max-h-80 md:max-h-96 object-cover rounded-xl"
                  />
                )}

                <p className="text-xs md:text-sm text-gray-400 mt-2">
                  {new Date(tweet.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4 px-2 text-gray-500">
              <button className="flex items-center gap-1 md:gap-2 hover:text-blue-500 group transition-colors p-1 md:p-2 rounded-lg hover:bg-blue-50">
                <FiMessageCircle size={16} className="md:w-5 md:h-5" />
                <span className="text-xs md:text-sm group-hover:bg-blue-100 group-hover:text-blue-500 rounded-full px-1 md:px-2 py-0.5 md:py-1">
                  {tweet.replies?.length || 0}
                </span>
              </button>

              <button
                onClick={() => handleRetweet(tweet._id)}
                className={`flex items-center gap-1 md:gap-2 transition-colors p-1 md:p-2 rounded-lg hover:bg-green-50 ${
                  tweet.retweets?.some(rt => rt.userId === user?.id) ? 'text-green-500' : 'hover:text-green-500'
                }`}
              >
                <AiOutlineRetweet size={16} className="md:w-5 md:h-5" />
                <span className="text-xs md:text-sm">{tweet.retweets?.length || 0}</span>
              </button>

              <button
                onClick={() => handleLike(tweet._id)}
                className={`flex items-center gap-1 md:gap-2 transition-colors p-1 md:p-2 rounded-lg hover:bg-red-50 ${
                  tweet.likes?.some(like => like.userId === user?.id) ? 'text-red-500' : 'hover:text-red-500'
                }`}
              >
                <FiHeart
                  size={16}
                  className="md:w-5 md:h-5"
                  fill={tweet.likes?.some(like => like.userId === user?.id) ? 'currentColor' : 'none'}
                />
                <span className="text-xs md:text-sm">{tweet.likes?.length || 0}</span>
              </button>

              {tweet.author?.userId === user?.id && (
                <button
                  onClick={() => handleDelete(tweet._id)}
                  className="flex items-center gap-1 md:gap-2 hover:text-red-500 transition-colors p-1 md:p-2 rounded-lg hover:bg-red-50"
                >
                  <FiTrash2 size={16} className="md:w-5 md:h-5" />
                </button>
              )}

              <button
                onClick={() => handleShare(tweet)}
                className="flex items-center gap-1 md:gap-2 hover:text-blue-500 transition-colors p-1 md:p-2 rounded-lg hover:bg-blue-50"
              >
                <FiShare size={16} className="md:w-5 md:h-5" />
              </button>
            </div>

            {/* Replies Section */}
            <RepliesSection
              tweetId={tweet._id}
              replies={tweet.replies}
              onRepliesUpdate={fetchTweets}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;