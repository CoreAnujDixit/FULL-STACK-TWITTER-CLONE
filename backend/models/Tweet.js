import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      userId: String,
      fullName: String,
      username: String,
      imageUrl: String,
    },
  },
  { timestamps: true }
);

const tweetSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    author: {
      userId: String,
      fullName: String,
      username: String,
      imageUrl: String,
    },
    likes: [
      {
        userId: String,
      },
    ],
    retweets: [
      {
        userId: String,
      },
    ],
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Tweet", tweetSchema);