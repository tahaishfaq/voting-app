//NPM Packages
const router = require("express").Router();

// controller

const { createIdea, getAll, voteIdea } = require("../controller/idea");

router.get("/getall", getAll);
router.post("/create/:userId", createIdea);

router.post("/vote/:id/:userId", voteIdea);

module.exports = router;
