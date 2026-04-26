import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/react";
import { FiUpload } from "react-icons/fi";

// Cloudinary Configuration
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

  // Handle cover image file selection
  const handleCoverImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload cover image to Cloudinary
  const uploadCoverImageToCloudinary = async () => {
    if (!coverImageFile) return coverImage; // Return existing URL if no new file

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
      return coverImage; // Return existing URL if upload fails
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate username
      if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
        alert("Username can only contain letters, numbers, and underscores");
        setLoading(false);
        return;
      }

      // Upload cover image if a new one was selected
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="username"
                className="flex-1 border rounded-lg p-2"
                maxLength="30"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Letters, numbers, and underscores only</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="w-full border rounded-lg p-2 resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Francisco, CA"
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            
            {/* Cover Image Preview */}
            {coverImagePreview && (
              <div className="mb-3 relative">
                <img
                  src={coverImagePreview}
                  alt="Cover Preview"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverImageFile(null);
                    setCoverImagePreview(user?.unsafeMetadata?.coverImage || "");
                  }}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80"
                >
                  ✕
                </button>
              </div>
            )}

            {/* File Upload Input */}
            <label className="flex items-center gap-2 border-2 border-dashed border-blue-300 rounded-lg p-4 cursor-pointer hover:bg-blue-50">
              <FiUpload size={20} className="text-blue-500" />
              <span className="text-sm text-gray-600">Click to upload cover image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border rounded-full py-2 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || uploading}
            className="flex-1 bg-blue-500 text-white rounded-full py-2 hover:bg-blue-600 disabled:opacity-50"
          >
            {loading || uploading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
