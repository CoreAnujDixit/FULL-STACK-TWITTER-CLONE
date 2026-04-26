import express from "express";
import Tweet from "../models/Tweet.js";

const router = express.Router();

// Search users by userId or username
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Get all tweets and extract unique users
    const tweets = await Tweet.find({});
    
    // Extract unique users from tweets
    const usersMap = new Map();
    tweets.forEach((tweet) => {
      const userId = tweet.author?.userId;
      if (userId && !usersMap.has(userId)) {
        usersMap.set(userId, {
          userId: tweet.author.userId,
          fullName: tweet.author.fullName,
          username: tweet.author.username,
          imageUrl: tweet.author.imageUrl,
        });
      }
    });

    const allUsers = Array.from(usersMap.values());

    // Filter by userId or username (case-insensitive)
    const searchResults = allUsers.filter(
      (user) =>
        user.userId.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.fullName.toLowerCase().includes(query.toLowerCase())
    );

    res.json(searchResults);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get user by userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Get all tweets from this user
    const userTweets = await Tweet.find({ "author.userId": userId });

    if (userTweets.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract user info from first tweet
    const userInfo = {
      userId: userTweets[0].author.userId,
      fullName: userTweets[0].author.fullName,
      username: userTweets[0].author.username,
      imageUrl: userTweets[0].author.imageUrl,
      tweetCount: userTweets.length,
    };

    res.json(userInfo);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
