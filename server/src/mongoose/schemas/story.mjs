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

    // ── Story Settings ──
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },

    genre: [{
      type: String,
    }],

    tags: [{
      type: String,
    }],

    language: {
      type: String,
      default: "English",
    },

    contentRating: {
      type: String,
      enum: ["everyone", "teen", "mature"],
      default: "everyone",
    },

    penName: {
      type: String,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },

    coverImage: {
      type: String,
      default: "",
    },

    coverImagePublicId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Story", StorySchema);