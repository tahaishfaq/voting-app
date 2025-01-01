const { default: mongoose } = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Title is required
    },
    idea: {
      type: String,
      required: true, // Idea description is required
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",  
      required: true, // User who created the idea
    },
    region: {
      type: String,
      required: true, // Region is required
    },
    isCollaborative: {
      type: Boolean,
      default: false, // Default is non-collaborative
    },
    votes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true, // User who voted on the idea
        },
      },
    ],
    votesCount: {
      type: Number,
      default: 0, // Default votes count is 0
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("idea", ideaSchema);
