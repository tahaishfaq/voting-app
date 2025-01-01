// NPM Packages 
const router = require("express").Router();

//paths
const user = require("./user");
const idea = require("./idea")

// routes
router.use("/user", user);
router.use("/idea", idea);


module.exports = router;
