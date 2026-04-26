import express from "express";
import Tweet from "../models/Tweet.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { text, author, image } = req.body;

    const tweet = await Tweet.create({ text, author, image });

    res.status(201).json(tweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const tweets = await Tweet.find().sort({ createdAt: -1 });
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/like/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Ensure likes is always an array
    if (!Array.isArray(tweet.likes)) {
      tweet.likes = [];
    }

    // Check if user already liked this tweet
    const likeIndex = tweet.likes.findIndex(like => like.userId === userId);

    if (likeIndex > -1) {
      // User already liked - remove the like (unlike)
      tweet.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked - add the like
      tweet.likes.push({ userId });
    }

    await tweet.save();
    res.json(tweet);
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Retweet endpoint
router.put("/retweet/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Ensure retweets is always an array
    if (!Array.isArray(tweet.retweets)) {
      tweet.retweets = [];
    }

    // Check if user already retweeted this tweet
    const retweetIndex = tweet.retweets.findIndex(rt => rt.userId === userId);

    if (retweetIndex > -1) {
      // User already retweeted - remove the retweet
      tweet.retweets.splice(retweetIndex, 1);
    } else {
      // User hasn't retweeted - add the retweet
      tweet.retweets.push({ userId });
    }

    await tweet.save();
    res.json(tweet);
  } catch (error) {
    console.error("Retweet error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Check if the user is the author
    if (tweet.author.userId !== userId) {
      return res.status(403).json({ message: "You can only delete your own tweets" });
    }

    await Tweet.findByIdAndDelete(req.params.id);

    res.json({ message: "Tweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add reply to tweet
router.post("/:id/reply", async (req, res) => {
  try {
    const { text, author } = req.body;
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const reply = {
      text,
      author,
    };

    tweet.replies.push(reply);
    await tweet.save();

    res.status(201).json(tweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete reply from tweet
router.delete("/:id/reply/:replyId", async (req, res) => {
  try {
    const { userId } = req.body;
    const { id, replyId } = req.params;

    const tweet = await Tweet.findById(id);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const reply = tweet.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    // Check if user is reply author
    if (reply.author.userId !== userId) {
      return res.status(403).json({ message: "You can only delete your own replies" });
    }

    tweet.replies.id(replyId).deleteOne();
    await tweet.save();

    res.json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;