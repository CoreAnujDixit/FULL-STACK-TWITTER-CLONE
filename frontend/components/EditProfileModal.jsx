import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/react";
import { FiUpload, FiX } from "react-icons/fi";

const CLOUDINARY_CLOUD_NAME = "dk13uacrq";
const CLOUDINARY_UPLOAD_PRESET = "twitter_clone";

function EditProfileModal({ isOpen, onClose, onSave }) {
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.unsafeMetadata?.username || user.username || "");
      setBio(user.unsafeMetadata?.bio || "");
      setLocation(user.unsafeMetadata?.location || "");
      setWebsite(user.unsafeMetadata?.website || "");
      setCoverImage(user.unsafeMetadata?.coverImage || "");
      setCoverImagePreview(user.unsafeMetadata?.coverImage || "");
    }
  }, [user, isOpen]);

  const handleCoverImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadCoverImageToCloudinary = async () => {
    if (!coverImageFile) return coverImage;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", coverImageFile);
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
      alert("Error uploading cover image: " + error.message);
      setUploading(false);
      return coverImage;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
        alert("Username can only contain letters, numbers, and underscores");
        return;
      }
      let finalCoverImage = coverImage;
      if (coverImageFile) {
        finalCoverImage = await uploadCoverImageToCloudinary();
      }
      await user.update({
        unsafeMetadata: {
          username: username || user.unsafeMetadata?.username || user.username || "",
          bio,
          location,
          website,
          coverImage: finalCoverImage,
        },
      });
      onSave();
      onClose();
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — full screen on mobile, centered sheet on sm+ */}
      <div className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-lg bg-white sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <FiX size={20} />
          </button>
          <h2 className="text-lg font-bold">Edit Profile</h2>
          <button
            onClick={handleSave}
            disabled={loading || uploading}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading || uploading ? "Saving…" : "Save"}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
            {coverImagePreview ? (
              <div className="relative mb-3">
                <img
                  src={coverImagePreview}
                  alt="Cover Preview"
                  className="w-full h-28 sm:h-36 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverImageFile(null);
                    setCoverImagePreview(user?.unsafeMetadata?.coverImage || "");
                  }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
                >
                  <FiX size={13} />
                </button>
              </div>
            ) : null}
            <label className="flex items-center gap-2 border-2 border-dashed border-blue-200 rounded-xl p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-colors">
              <FiUpload size={18} className="text-blue-500 shrink-0" />
              <span className="text-sm text-gray-600">Click to upload cover image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
            <div className="flex items-center border rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
              <span className="text-gray-500 text-sm mr-1">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="username"
                className="flex-1 outline-none text-sm bg-transparent"
                maxLength="30"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Letters, numbers, and underscores only</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="w-full border rounded-xl px-3 py-2.5 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              rows="3"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Francisco, CA"
              className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfileModal;