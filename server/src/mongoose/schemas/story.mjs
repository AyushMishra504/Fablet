import mongoose from "mongoose";

const StorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "newUser",
      required: true,
    },

    title: {
      type: String,
      default: "Untitled Story",
    },

    content: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    wordCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Story", StorySchema);