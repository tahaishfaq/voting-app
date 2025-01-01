// Schema
const Idea = require("../models/Idea");
const { ideaSchema } = require("../schema/idea");

/**
 * @desciption Create an idea
 * @route POST /api/idea/create-idea/:userId
 * @access Public
 */
module.exports.createIdea = async (req, res) => {
  const { title, idea, region, isCollaborative } = req.body;
  const { userId } = req.params;

  // Validate input data
  if (!title || !idea || !region) {
    return res.status(400).json({
      status: false,
      msg: "Title, idea description, and region are required.",
    });
  }

  try {
    // Create a new idea
    const newIdea = await Idea.create({
      title,
      idea,
      region,
      isCollaborative,
      userId,
    });

    return res.status(201).json({
      status: true,
      msg: "Idea created successfully",
      idea: newIdea,
    });
  } catch (error) {
    console.error("Error while creating idea:", error);
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

/**
 * @desciption Get all ideas with pagination
 * @route GET /api/idea/getall-idea
 * @access Public
 */
module.exports.getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    // Fetch all ideas with pagination and sort by creation date
    const allIdeas = await Idea.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name"); // Populate user name for the userId reference

    const totalIdeas = await Idea.countDocuments();

    return res.status(200).json({
      status: true,
      ideas: allIdeas,
      currentPage: page,
      totalPages: Math.ceil(totalIdeas / limit),
      totalIdeas: totalIdeas,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

/**
 * @desciption Vote for an idea
 * @route POST /api/idea/vote/:id/:userId
 * @access Private
 */
module.exports.voteIdea = async (req, res) => {
  const { id, userId } = req.params;

  try {
    // Find the idea by ID
    const idea = await Idea.findById(id);

    if (!idea) {
      return res.status(404).json({
        status: false,
        msg: "Idea not found",
      });
    }

    // Check if the user has already voted
    const alreadyVoted = idea.votes.some(
      (vote) => vote.userId.toString() === userId.toString()
    );

    if (alreadyVoted) {
      return res.status(400).json({
        status: false,
        msg: "You have already voted for this idea",
      });
    }

    // Add the vote
    idea.votes.push({ userId });
    idea.votesCount += 1;

    // Save the updated idea
    await idea.save();

    return res.status(200).json({
      status: true,
      msg: "Vote added successfully",
      data: idea,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};
